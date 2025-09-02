// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title VestingContract
 * @dev A contract for token vesting with cliff and linear vesting periods
 */
contract VestingContract is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Vesting schedule struct
    struct VestingSchedule {
        address beneficiary;
        uint256 start;
        uint256 cliff;
        uint256 duration;
        uint256 totalAmount;
        uint256 releasedAmount;
        bool revocable;
        bool revoked;
    }

    // Token being vested
    IERC20 public token;

    // Vesting schedules
    mapping(bytes32 => VestingSchedule) public vestingSchedules;
    bytes32[] public vestingScheduleIds;
    mapping(address => bytes32[]) public holdersVestingScheduleIds;

    // Total amount of tokens in all vesting schedules
    uint256 public vestingSchedulesTotalAmount;

    // Events
    event VestingScheduleCreated(bytes32 indexed id, address indexed beneficiary, uint256 amount);
    event VestingScheduleReleased(bytes32 indexed id, address indexed beneficiary, uint256 amount);
    event VestingScheduleRevoked(bytes32 indexed id, address indexed beneficiary, uint256 amount);

    /**
     * @dev Constructor
     * @param _token The token to be vested
     */
    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "VestingContract: token is zero address");
        token = IERC20(_token);
    }

    /**
     * @dev Creates a new vesting schedule
     * @param _beneficiary The address that will receive the tokens
     * @param _start The start timestamp of the vesting period
     * @param _cliff The cliff period in seconds
     * @param _duration The total duration of the vesting period in seconds
     * @param _amount The total amount of tokens to be vested
     * @param _revocable Whether the vesting schedule can be revoked
     */
    function createVestingSchedule(
        address _beneficiary,
        uint256 _start,
        uint256 _cliff,
        uint256 _duration,
        uint256 _amount,
        bool _revocable
    ) public onlyOwner {
        require(_beneficiary != address(0), "VestingContract: beneficiary is zero address");
        require(_duration > 0, "VestingContract: duration must be > 0");
        require(_amount > 0, "VestingContract: amount must be > 0");
        require(_cliff <= _duration, "VestingContract: cliff must be <= duration");
        require(
            token.balanceOf(address(this)) >= vestingSchedulesTotalAmount + _amount,
            "VestingContract: insufficient tokens"
        );

        bytes32 id = computeVestingScheduleId(_beneficiary, vestingScheduleIds.length);
        vestingSchedules[id] = VestingSchedule({
            beneficiary: _beneficiary,
            start: _start,
            cliff: _start + _cliff,
            duration: _duration,
            totalAmount: _amount,
            releasedAmount: 0,
            revocable: _revocable,
            revoked: false
        });

        vestingScheduleIds.push(id);
        holdersVestingScheduleIds[_beneficiary].push(id);
        vestingSchedulesTotalAmount += _amount;

        emit VestingScheduleCreated(id, _beneficiary, _amount);
    }

    /**
     * @dev Releases vested tokens for a specific vesting schedule
     * @param _id The ID of the vesting schedule
     */
    function release(bytes32 _id) public nonReentrant {
        VestingSchedule storage schedule = vestingSchedules[_id];
        require(
            msg.sender == schedule.beneficiary || msg.sender == owner(),
            "VestingContract: not authorized"
        );
        require(!schedule.revoked, "VestingContract: vesting schedule revoked");

        uint256 vestedAmount = _computeVestedAmount(schedule);
        uint256 releasableAmount = vestedAmount - schedule.releasedAmount;
        require(releasableAmount > 0, "VestingContract: no tokens to release");

        schedule.releasedAmount += releasableAmount;
        vestingSchedulesTotalAmount -= releasableAmount;
        token.safeTransfer(schedule.beneficiary, releasableAmount);

        emit VestingScheduleReleased(_id, schedule.beneficiary, releasableAmount);
    }

    /**
     * @dev Revokes a vesting schedule
     * @param _id The ID of the vesting schedule
     */
    function revoke(bytes32 _id) public onlyOwner {
        VestingSchedule storage schedule = vestingSchedules[_id];
        require(schedule.revocable, "VestingContract: vesting schedule not revocable");
        require(!schedule.revoked, "VestingContract: vesting schedule already revoked");

        uint256 vestedAmount = _computeVestedAmount(schedule);
        uint256 releasableAmount = vestedAmount - schedule.releasedAmount;
        uint256 unreleased = schedule.totalAmount - schedule.releasedAmount;

        if (releasableAmount > 0) {
            schedule.releasedAmount += releasableAmount;
            token.safeTransfer(schedule.beneficiary, releasableAmount);
            emit VestingScheduleReleased(_id, schedule.beneficiary, releasableAmount);
        }

        uint256 refundAmount = unreleased - releasableAmount;
        if (refundAmount > 0) {
            vestingSchedulesTotalAmount -= refundAmount;
            token.safeTransfer(owner(), refundAmount);
        }

        schedule.revoked = true;
        emit VestingScheduleRevoked(_id, schedule.beneficiary, refundAmount);
    }

    /**
     * @dev Computes the vested amount for a vesting schedule
     * @param _schedule The vesting schedule
     * @return The vested amount
     */
    function _computeVestedAmount(VestingSchedule memory _schedule) internal view returns (uint256) {
        if (block.timestamp < _schedule.cliff) {
            return 0;
        }
        if (block.timestamp >= _schedule.start + _schedule.duration || _schedule.revoked) {
            return _schedule.totalAmount;
        }
        uint256 timeFromStart = block.timestamp - _schedule.start;
        return (_schedule.totalAmount * timeFromStart) / _schedule.duration;
    }

    /**
     * @dev Computes the vesting schedule ID
     * @param _beneficiary The address of the beneficiary
     * @param _index The index of the vesting schedule
     * @return The vesting schedule ID
     */
    function computeVestingScheduleId(address _beneficiary, uint256 _index) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_beneficiary, _index));
    }

    /**
     * @dev Gets the vesting schedule information for a given identifier
     * @param _id The ID of the vesting schedule
     * @return The vesting schedule information
     */
    function getVestingSchedule(bytes32 _id) public view returns (VestingSchedule memory) {
        return vestingSchedules[_id];
    }

    /**
     * @dev Gets the vesting schedule IDs for a beneficiary
     * @param _beneficiary The address of the beneficiary
     * @return The vesting schedule IDs
     */
    function getVestingScheduleIdsByBeneficiary(address _beneficiary) public view returns (bytes32[] memory) {
        return holdersVestingScheduleIds[_beneficiary];
    }

    /**
     * @dev Gets the total number of vesting schedules
     * @return The total number of vesting schedules
     */
    function getVestingSchedulesCount() public view returns (uint256) {
        return vestingScheduleIds.length;
    }

    /**
     * @dev Gets the vested amount for a vesting schedule
     * @param _id The ID of the vesting schedule
     * @return The vested amount
     */
    function getVestedAmount(bytes32 _id) public view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[_id];
        return _computeVestedAmount(schedule);
    }

    /**
     * @dev Gets the releasable amount for a vesting schedule
     * @param _id The ID of the vesting schedule
     * @return The releasable amount
     */
    function getReleasableAmount(bytes32 _id) public view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[_id];
        uint256 vestedAmount = _computeVestedAmount(schedule);
        return vestedAmount - schedule.releasedAmount;
    }

    /**
     * @dev Withdraws tokens from the contract
     * @param _amount The amount of tokens to withdraw
     */
    function withdraw(uint256 _amount) public onlyOwner {
        require(
            token.balanceOf(address(this)) - vestingSchedulesTotalAmount >= _amount,
            "VestingContract: insufficient withdrawable funds"
        );
        token.safeTransfer(owner(), _amount);
    }
}

