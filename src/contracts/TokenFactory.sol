// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC20Token.sol";
import "./BEP20Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenFactory
 * @dev Factory contract for creating new ERC20 and BEP20 tokens
 */
contract TokenFactory is Ownable {
    // Events
    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol,
        uint8 decimals,
        uint256 initialSupply,
        string tokenType,
        address owner
    );

    // Fee structure
    uint256 public baseFee;
    uint256 public mintableFee;
    uint256 public burnableFee;
    uint256 public pausableFee;

    // Constructor
    constructor(
        uint256 _baseFee,
        uint256 _mintableFee,
        uint256 _burnableFee,
        uint256 _pausableFee
    ) Ownable(msg.sender) {
        baseFee = _baseFee;
        mintableFee = _mintableFee;
        burnableFee = _burnableFee;
        pausableFee = _pausableFee;
    }

    /**
     * @dev Creates a new ERC20 token
     * @param name The name of the token
     * @param symbol The symbol of the token
     * @param decimals The number of decimals for the token
     * @param initialSupply The initial supply of tokens
     * @param mintable Whether the token is mintable
     * @param burnable Whether the token is burnable
     * @param pausable Whether the token is pausable
     * @return The address of the newly created token
     */
    function createERC20Token(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialSupply,
        bool mintable,
        bool burnable,
        bool pausable
    ) public payable returns (address) {
        // Calculate fee
        uint256 fee = calculateFee(mintable, burnable, pausable);
        require(msg.value >= fee, "TokenFactory: insufficient fee");

        // Create token
        ERC20Token token = new ERC20Token(
            name,
            symbol,
            decimals,
            initialSupply,
            mintable,
            pausable,
            msg.sender
        );

        // Emit event
        emit TokenCreated(
            address(token),
            name,
            symbol,
            decimals,
            initialSupply,
            "ERC20",
            msg.sender
        );

        // Return excess fee
        if (msg.value > fee) {
            payable(msg.sender).transfer(msg.value - fee);
        }

        return address(token);
    }

    /**
     * @dev Creates a new BEP20 token
     * @param name The name of the token
     * @param symbol The symbol of the token
     * @param decimals The number of decimals for the token
     * @param initialSupply The initial supply of tokens
     * @param mintable Whether the token is mintable
     * @param burnable Whether the token is burnable
     * @param pausable Whether the token is pausable
     * @param tokenURI The URI for token metadata
     * @return The address of the newly created token
     */
    function createBEP20Token(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialSupply,
        bool mintable,
        bool burnable,
        bool pausable,
        string memory tokenURI
    ) public payable returns (address) {
        // Calculate fee
        uint256 fee = calculateFee(mintable, burnable, pausable);
        require(msg.value >= fee, "TokenFactory: insufficient fee");

        // Create token
        BEP20Token token = new BEP20Token(
            name,
            symbol,
            decimals,
            initialSupply,
            mintable,
            pausable,
            msg.sender,
            tokenURI
        );

        // Emit event
        emit TokenCreated(
            address(token),
            name,
            symbol,
            decimals,
            initialSupply,
            "BEP20",
            msg.sender
        );

        // Return excess fee
        if (msg.value > fee) {
            payable(msg.sender).transfer(msg.value - fee);
        }

        return address(token);
    }

    /**
     * @dev Calculates the fee for creating a token
     * @param mintable Whether the token is mintable
     * @param burnable Whether the token is burnable
     * @param pausable Whether the token is pausable
     * @return The fee for creating the token
     */
    function calculateFee(
        bool mintable,
        bool burnable,
        bool pausable
    ) public view returns (uint256) {
        uint256 fee = baseFee;
        if (mintable) fee += mintableFee;
        if (burnable) fee += burnableFee;
        if (pausable) fee += pausableFee;
        return fee;
    }

    /**
     * @dev Updates the fee structure
     * @param _baseFee The new base fee
     * @param _mintableFee The new mintable fee
     * @param _burnableFee The new burnable fee
     * @param _pausableFee The new pausable fee
     */
    function updateFees(
        uint256 _baseFee,
        uint256 _mintableFee,
        uint256 _burnableFee,
        uint256 _pausableFee
    ) public onlyOwner {
        baseFee = _baseFee;
        mintableFee = _mintableFee;
        burnableFee = _burnableFee;
        pausableFee = _pausableFee;
    }

    /**
     * @dev Withdraws the collected fees
     * @param to The address to withdraw the fees to
     */
    function withdrawFees(address payable to) public onlyOwner {
        to.transfer(address(this).balance);
    }
}

