// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenGate
 * @dev A contract for token-gated access control
 */
contract TokenGate is Ownable {
    // Gate struct
    struct Gate {
        string name;
        address tokenAddress;
        uint256 minBalance;
        string contentType;
        string contentURI;
        bool isActive;
        uint256 accessCount;
    }

    // Gates
    mapping(uint256 => Gate) public gates;
    uint256 public gateCount;

    // Access records
    mapping(address => mapping(uint256 => bool)) public hasAccessed;

    // Events
    event GateCreated(uint256 indexed gateId, string name, address tokenAddress, uint256 minBalance);
    event GateUpdated(uint256 indexed gateId, string name, address tokenAddress, uint256 minBalance, bool isActive);
    event GateAccessed(uint256 indexed gateId, address indexed user);

    /**
     * @dev Constructor
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @dev Creates a new gate
     * @param _name The name of the gate
     * @param _tokenAddress The address of the token required for access
     * @param _minBalance The minimum token balance required for access
     * @param _contentType The type of content being gated
     * @param _contentURI The URI of the gated content
     * @return The ID of the newly created gate
     */
    function createGate(
        string memory _name,
        address _tokenAddress,
        uint256 _minBalance,
        string memory _contentType,
        string memory _contentURI
    ) public onlyOwner returns (uint256) {
        require(_tokenAddress != address(0), "TokenGate: token address is zero address");
        require(_minBalance > 0, "TokenGate: minimum balance must be > 0");

        uint256 gateId = gateCount;
        gates[gateId] = Gate({
            name: _name,
            tokenAddress: _tokenAddress,
            minBalance: _minBalance,
            contentType: _contentType,
            contentURI: _contentURI,
            isActive: true,
            accessCount: 0
        });

        gateCount++;
        emit GateCreated(gateId, _name, _tokenAddress, _minBalance);
        return gateId;
    }

    /**
     * @dev Updates an existing gate
     * @param _gateId The ID of the gate to update
     * @param _name The new name of the gate
     * @param _tokenAddress The new address of the token required for access
     * @param _minBalance The new minimum token balance required for access
     * @param _contentType The new type of content being gated
     * @param _contentURI The new URI of the gated content
     * @param _isActive Whether the gate is active
     */
    function updateGate(
        uint256 _gateId,
        string memory _name,
        address _tokenAddress,
        uint256 _minBalance,
        string memory _contentType,
        string memory _contentURI,
        bool _isActive
    ) public onlyOwner {
        require(_gateId < gateCount, "TokenGate: gate does not exist");
        require(_tokenAddress != address(0), "TokenGate: token address is zero address");
        require(_minBalance > 0, "TokenGate: minimum balance must be > 0");

        Gate storage gate = gates[_gateId];
        gate.name = _name;
        gate.tokenAddress = _tokenAddress;
        gate.minBalance = _minBalance;
        gate.contentType = _contentType;
        gate.contentURI = _contentURI;
        gate.isActive = _isActive;

        emit GateUpdated(_gateId, _name, _tokenAddress, _minBalance, _isActive);
    }

    /**
     * @dev Toggles the active state of a gate
     * @param _gateId The ID of the gate to toggle
     */
    function toggleGate(uint256 _gateId) public onlyOwner {
        require(_gateId < gateCount, "TokenGate: gate does not exist");
        gates[_gateId].isActive = !gates[_gateId].isActive;
        emit GateUpdated(
            _gateId,
            gates[_gateId].name,
            gates[_gateId].tokenAddress,
            gates[_gateId].minBalance,
            gates[_gateId].isActive
        );
    }

    /**
     * @dev Checks if a user has access to a gate
     * @param _gateId The ID of the gate to check
     * @param _user The address of the user to check
     * @return Whether the user has access to the gate
     */
    function checkAccess(uint256 _gateId, address _user) public view returns (bool) {
        require(_gateId < gateCount, "TokenGate: gate does not exist");
        Gate memory gate = gates[_gateId];
        
        if (!gate.isActive) {
            return false;
        }
        
        IERC20 token = IERC20(gate.tokenAddress);
        return token.balanceOf(_user) >= gate.minBalance;
    }

    /**
     * @dev Records access to a gate
     * @param _gateId The ID of the gate being accessed
     */
    function recordAccess(uint256 _gateId) public {
        require(_gateId < gateCount, "TokenGate: gate does not exist");
        require(gates[_gateId].isActive, "TokenGate: gate is not active");
        
        IERC20 token = IERC20(gates[_gateId].tokenAddress);
        require(
            token.balanceOf(msg.sender) >= gates[_gateId].minBalance,
            "TokenGate: insufficient token balance"
        );
        
        if (!hasAccessed[msg.sender][_gateId]) {
            hasAccessed[msg.sender][_gateId] = true;
        }
        
        gates[_gateId].accessCount++;
        emit GateAccessed(_gateId, msg.sender);
    }

    /**
     * @dev Gets the content URI for a gate if the user has access
     * @param _gateId The ID of the gate
     * @return The content URI if the user has access, empty string otherwise
     */
    function getContentURI(uint256 _gateId) public view returns (string memory) {
        require(_gateId < gateCount, "TokenGate: gate does not exist");
        
        if (checkAccess(_gateId, msg.sender)) {
            return gates[_gateId].contentURI;
        }
        
        return "";
    }

    /**
     * @dev Gets the details of a gate
     * @param _gateId The ID of the gate
     * @return The gate details
     */
    function getGate(uint256 _gateId) public view returns (Gate memory) {
        require(_gateId < gateCount, "TokenGate: gate does not exist");
        return gates[_gateId];
    }

    /**
     * @dev Gets all gates
     * @return An array of all gates
     */
    function getAllGates() public view returns (Gate[] memory) {
        Gate[] memory allGates = new Gate[](gateCount);
        for (uint256 i = 0; i < gateCount; i++) {
            allGates[i] = gates[i];
        }
        return allGates;
    }
}

