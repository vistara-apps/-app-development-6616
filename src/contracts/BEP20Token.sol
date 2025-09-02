// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BEP20Token
 * @dev Implementation of the BEP20 Token standard.
 * BEP20 is essentially identical to ERC20 but is used on Binance Smart Chain.
 * This implementation includes optional features:
 * - Ability to mint new tokens
 * - Ability to burn tokens
 * - Ability to pause token transfers
 */
contract BEP20Token is ERC20, ERC20Burnable, ERC20Pausable, Ownable {
    uint8 private _decimals;
    bool private _mintable;
    
    // BEP20 specific metadata
    string private _tokenURI;

    /**
     * @dev Constructor that gives the msg.sender the total supply of tokens.
     * @param name_ The name of the token
     * @param symbol_ The symbol of the token
     * @param decimals_ The number of decimals for the token
     * @param initialSupply The initial supply of tokens
     * @param mintable_ Whether the token is mintable
     * @param pausable_ Whether the token is pausable
     * @param owner The owner of the token contract
     * @param tokenURI_ The URI for token metadata (BEP20 specific)
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 initialSupply,
        bool mintable_,
        bool pausable_,
        address owner,
        string memory tokenURI_
    ) ERC20(name_, symbol_) Ownable(owner) {
        _decimals = decimals_;
        _mintable = mintable_;
        _tokenURI = tokenURI_;
        
        // Mint initial supply to the owner
        _mint(owner, initialSupply * (10 ** decimals_));
        
        // If the token is not pausable, renounce the ability to pause
        if (!pausable_) {
            _disablePause();
        }
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Returns the URI for token metadata (BEP20 specific)
     */
    function tokenURI() public view returns (string memory) {
        return _tokenURI;
    }

    /**
     * @dev Sets the URI for token metadata (BEP20 specific)
     * @param tokenURI_ The new URI for token metadata
     */
    function setTokenURI(string memory tokenURI_) public onlyOwner {
        _tokenURI = tokenURI_;
    }

    /**
     * @dev Creates `amount` new tokens for `to`.
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(_mintable, "BEP20Token: token is not mintable");
        _mint(to, amount);
    }

    /**
     * @dev Pauses all token transfers.
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses all token transfers.
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Disables the ability to pause the token permanently.
     */
    function _disablePause() internal {
        // This is a placeholder for disabling pause functionality
        // In a real implementation, this would revoke the pause role or similar
    }

    /**
     * @dev Hook that is called before any transfer of tokens.
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}

