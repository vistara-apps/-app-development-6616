# TokenSmith Smart Contract Interfaces

This document provides detailed information about the TokenSmith smart contracts, including function signatures, events, and examples.

## Table of Contents

1. [TokenFactory](#tokenfactory)
2. [ERC20Token](#erc20token)
3. [BEP20Token](#bep20token)
4. [VestingContract](#vestingcontract)
5. [TokenGate](#tokengate)
6. [DAOGovernance](#daogovernance)

## TokenFactory

The TokenFactory contract is responsible for creating new ERC-20 and BEP-20 tokens.

### Contract Address

- Base Mainnet: `0x...` (TBD)
- Base Testnet: `0x...` (TBD)

### Functions

#### `createERC20Token`

Creates a new ERC-20 token.

```solidity
function createERC20Token(
    string memory name,
    string memory symbol,
    uint8 decimals,
    uint256 initialSupply,
    bool mintable,
    bool burnable,
    bool pausable
) public payable returns (address)
```

**Parameters:**
- `name` - The name of the token
- `symbol` - The symbol of the token
- `decimals` - The number of decimals for the token
- `initialSupply` - The initial supply of tokens
- `mintable` - Whether the token is mintable
- `burnable` - Whether the token is burnable
- `pausable` - Whether the token is pausable

**Returns:**
- The address of the newly created token

#### `createBEP20Token`

Creates a new BEP-20 token.

```solidity
function createBEP20Token(
    string memory name,
    string memory symbol,
    uint8 decimals,
    uint256 initialSupply,
    bool mintable,
    bool burnable,
    bool pausable,
    string memory tokenURI
) public payable returns (address)
```

**Parameters:**
- `name` - The name of the token
- `symbol` - The symbol of the token
- `decimals` - The number of decimals for the token
- `initialSupply` - The initial supply of tokens
- `mintable` - Whether the token is mintable
- `burnable` - Whether the token is burnable
- `pausable` - Whether the token is pausable
- `tokenURI` - The URI for token metadata

**Returns:**
- The address of the newly created token

#### `calculateFee`

Calculates the fee for creating a token.

```solidity
function calculateFee(
    bool mintable,
    bool burnable,
    bool pausable
) public view returns (uint256)
```

**Parameters:**
- `mintable` - Whether the token is mintable
- `burnable` - Whether the token is burnable
- `pausable` - Whether the token is pausable

**Returns:**
- The fee for creating the token

### Events

#### `TokenCreated`

Emitted when a new token is created.

```solidity
event TokenCreated(
    address indexed tokenAddress,
    string name,
    string symbol,
    uint8 decimals,
    uint256 initialSupply,
    string tokenType,
    address owner
)
```

**Parameters:**
- `tokenAddress` - The address of the newly created token
- `name` - The name of the token
- `symbol` - The symbol of the token
- `decimals` - The number of decimals for the token
- `initialSupply` - The initial supply of tokens
- `tokenType` - The type of token (ERC-20 or BEP-20)
- `owner` - The owner of the token

## ERC20Token

The ERC20Token contract is a standard ERC-20 token with additional features like minting, burning, and pausing.

### Functions

#### `mint`

Creates new tokens and assigns them to an address.

```solidity
function mint(address to, uint256 amount) public onlyOwner
```

**Parameters:**
- `to` - The address to mint tokens to
- `amount` - The amount of tokens to mint

#### `burn`

Burns tokens from the caller's address.

```solidity
function burn(uint256 amount) public
```

**Parameters:**
- `amount` - The amount of tokens to burn

#### `burnFrom`

Burns tokens from a specific address.

```solidity
function burnFrom(address account, uint256 amount) public
```

**Parameters:**
- `account` - The address to burn tokens from
- `amount` - The amount of tokens to burn

#### `pause`

Pauses all token transfers.

```solidity
function pause() public onlyOwner
```

#### `unpause`

Unpauses all token transfers.

```solidity
function unpause() public onlyOwner
```

### Events

#### `Transfer`

Emitted when tokens are transferred.

```solidity
event Transfer(address indexed from, address indexed to, uint256 value)
```

**Parameters:**
- `from` - The address tokens are transferred from
- `to` - The address tokens are transferred to
- `value` - The amount of tokens transferred

#### `Approval`

Emitted when an approval is set.

```solidity
event Approval(address indexed owner, address indexed spender, uint256 value)
```

**Parameters:**
- `owner` - The address that approved the spending
- `spender` - The address that was approved to spend
- `value` - The amount of tokens approved

#### `Paused`

Emitted when the token is paused.

```solidity
event Paused(address account)
```

**Parameters:**
- `account` - The address that paused the token

#### `Unpaused`

Emitted when the token is unpaused.

```solidity
event Unpaused(address account)
```

**Parameters:**
- `account` - The address that unpaused the token

## BEP20Token

The BEP20Token contract is similar to the ERC20Token contract but includes additional BEP-20 specific features.

### Functions

#### `setTokenURI`

Sets the URI for token metadata.

```solidity
function setTokenURI(string memory tokenURI_) public onlyOwner
```

**Parameters:**
- `tokenURI_` - The new URI for token metadata

#### `tokenURI`

Returns the URI for token metadata.

```solidity
function tokenURI() public view returns (string memory)
```

**Returns:**
- The URI for token metadata

## VestingContract

The VestingContract contract is responsible for managing token vesting schedules.

### Contract Address

- Base Mainnet: `0x...` (TBD)
- Base Testnet: `0x...` (TBD)

### Functions

#### `createVestingSchedule`

Creates a new vesting schedule.

```solidity
function createVestingSchedule(
    address _beneficiary,
    uint256 _start,
    uint256 _cliff,
    uint256 _duration,
    uint256 _amount,
    bool _revocable
) public onlyOwner
```

**Parameters:**
- `_beneficiary` - The address that will receive the tokens
- `_start` - The start timestamp of the vesting period
- `_cliff` - The cliff period in seconds
- `_duration` - The total duration of the vesting period in seconds
- `_amount` - The total amount of tokens to be vested
- `_revocable` - Whether the vesting schedule can be revoked

#### `release`

Releases vested tokens for a specific vesting schedule.

```solidity
function release(bytes32 _id) public nonReentrant
```

**Parameters:**
- `_id` - The ID of the vesting schedule

#### `revoke`

Revokes a vesting schedule.

```solidity
function revoke(bytes32 _id) public onlyOwner
```

**Parameters:**
- `_id` - The ID of the vesting schedule

#### `getVestingSchedule`

Gets the vesting schedule information for a given identifier.

```solidity
function getVestingSchedule(bytes32 _id) public view returns (VestingSchedule memory)
```

**Parameters:**
- `_id` - The ID of the vesting schedule

**Returns:**
- The vesting schedule information

#### `getVestingScheduleIdsByBeneficiary`

Gets the vesting schedule IDs for a beneficiary.

```solidity
function getVestingScheduleIdsByBeneficiary(address _beneficiary) public view returns (bytes32[] memory)
```

**Parameters:**
- `_beneficiary` - The address of the beneficiary

**Returns:**
- The vesting schedule IDs

#### `getVestedAmount`

Gets the vested amount for a vesting schedule.

```solidity
function getVestedAmount(bytes32 _id) public view returns (uint256)
```

**Parameters:**
- `_id` - The ID of the vesting schedule

**Returns:**
- The vested amount

#### `getReleasableAmount`

Gets the releasable amount for a vesting schedule.

```solidity
function getReleasableAmount(bytes32 _id) public view returns (uint256)
```

**Parameters:**
- `_id` - The ID of the vesting schedule

**Returns:**
- The releasable amount

### Events

#### `VestingScheduleCreated`

Emitted when a new vesting schedule is created.

```solidity
event VestingScheduleCreated(bytes32 indexed id, address indexed beneficiary, uint256 amount)
```

**Parameters:**
- `id` - The ID of the vesting schedule
- `beneficiary` - The address that will receive the tokens
- `amount` - The total amount of tokens to be vested

#### `VestingScheduleReleased`

Emitted when vested tokens are released.

```solidity
event VestingScheduleReleased(bytes32 indexed id, address indexed beneficiary, uint256 amount)
```

**Parameters:**
- `id` - The ID of the vesting schedule
- `beneficiary` - The address that received the tokens
- `amount` - The amount of tokens released

#### `VestingScheduleRevoked`

Emitted when a vesting schedule is revoked.

```solidity
event VestingScheduleRevoked(bytes32 indexed id, address indexed beneficiary, uint256 amount)
```

**Parameters:**
- `id` - The ID of the vesting schedule
- `beneficiary` - The address that was supposed to receive the tokens
- `amount` - The amount of tokens refunded

## TokenGate

The TokenGate contract is responsible for managing token-gated access.

### Contract Address

- Base Mainnet: `0x...` (TBD)
- Base Testnet: `0x...` (TBD)

### Functions

#### `createGate`

Creates a new gate.

```solidity
function createGate(
    string memory _name,
    address _tokenAddress,
    uint256 _minBalance,
    string memory _contentType,
    string memory _contentURI
) public onlyOwner returns (uint256)
```

**Parameters:**
- `_name` - The name of the gate
- `_tokenAddress` - The address of the token required for access
- `_minBalance` - The minimum token balance required for access
- `_contentType` - The type of content being gated
- `_contentURI` - The URI of the gated content

**Returns:**
- The ID of the newly created gate

#### `updateGate`

Updates an existing gate.

```solidity
function updateGate(
    uint256 _gateId,
    string memory _name,
    address _tokenAddress,
    uint256 _minBalance,
    string memory _contentType,
    string memory _contentURI,
    bool _isActive
) public onlyOwner
```

**Parameters:**
- `_gateId` - The ID of the gate to update
- `_name` - The new name of the gate
- `_tokenAddress` - The new address of the token required for access
- `_minBalance` - The new minimum token balance required for access
- `_contentType` - The new type of content being gated
- `_contentURI` - The new URI of the gated content
- `_isActive` - Whether the gate is active

#### `toggleGate`

Toggles the active state of a gate.

```solidity
function toggleGate(uint256 _gateId) public onlyOwner
```

**Parameters:**
- `_gateId` - The ID of the gate to toggle

#### `checkAccess`

Checks if a user has access to a gate.

```solidity
function checkAccess(uint256 _gateId, address _user) public view returns (bool)
```

**Parameters:**
- `_gateId` - The ID of the gate to check
- `_user` - The address of the user to check

**Returns:**
- Whether the user has access to the gate

#### `recordAccess`

Records access to a gate.

```solidity
function recordAccess(uint256 _gateId) public
```

**Parameters:**
- `_gateId` - The ID of the gate being accessed

#### `getContentURI`

Gets the content URI for a gate if the user has access.

```solidity
function getContentURI(uint256 _gateId) public view returns (string memory)
```

**Parameters:**
- `_gateId` - The ID of the gate

**Returns:**
- The content URI if the user has access, empty string otherwise

#### `getGate`

Gets the details of a gate.

```solidity
function getGate(uint256 _gateId) public view returns (Gate memory)
```

**Parameters:**
- `_gateId` - The ID of the gate

**Returns:**
- The gate details

#### `getAllGates`

Gets all gates.

```solidity
function getAllGates() public view returns (Gate[] memory)
```

**Returns:**
- An array of all gates

### Events

#### `GateCreated`

Emitted when a new gate is created.

```solidity
event GateCreated(uint256 indexed gateId, string name, address tokenAddress, uint256 minBalance)
```

**Parameters:**
- `gateId` - The ID of the gate
- `name` - The name of the gate
- `tokenAddress` - The address of the token required for access
- `minBalance` - The minimum token balance required for access

#### `GateUpdated`

Emitted when a gate is updated.

```solidity
event GateUpdated(uint256 indexed gateId, string name, address tokenAddress, uint256 minBalance, bool isActive)
```

**Parameters:**
- `gateId` - The ID of the gate
- `name` - The name of the gate
- `tokenAddress` - The address of the token required for access
- `minBalance` - The minimum token balance required for access
- `isActive` - Whether the gate is active

#### `GateAccessed`

Emitted when a gate is accessed.

```solidity
event GateAccessed(uint256 indexed gateId, address indexed user)
```

**Parameters:**
- `gateId` - The ID of the gate
- `user` - The address of the user accessing the gate

## DAOGovernance

The DAOGovernance contract is responsible for managing DAO proposals and votes.

### Contract Address

- Base Mainnet: `0x...` (TBD)
- Base Testnet: `0x...` (TBD)

### Functions

#### `createProposal`

Creates a new proposal.

```solidity
function createProposal(
    string memory _title,
    string memory _description,
    uint256 _quorum
) public returns (uint256)
```

**Parameters:**
- `_title` - The title of the proposal
- `_description` - The description of the proposal
- `_quorum` - The minimum number of votes required for the proposal to pass

**Returns:**
- The ID of the newly created proposal

#### `castVote`

Casts a vote on a proposal.

```solidity
function castVote(uint256 _proposalId, bool _support) public nonReentrant
```

**Parameters:**
- `_proposalId` - The ID of the proposal to vote on
- `_support` - Whether to support the proposal

#### `executeProposal`

Executes a proposal if it has passed.

```solidity
function executeProposal(uint256 _proposalId) public
```

**Parameters:**
- `_proposalId` - The ID of the proposal to execute

#### `cancelProposal`

Cancels a proposal.

```solidity
function cancelProposal(uint256 _proposalId) public
```

**Parameters:**
- `_proposalId` - The ID of the proposal to cancel

#### `getProposalState`

Gets the state of a proposal.

```solidity
function getProposalState(uint256 _proposalId) public view returns (uint8)
```

**Parameters:**
- `_proposalId` - The ID of the proposal

**Returns:**
- The state of the proposal (0: Pending, 1: Active, 2: Succeeded, 3: Failed, 4: Executed, 5: Canceled)

#### `getProposalSummary`

Gets a summary of a proposal.

```solidity
function getProposalSummary(uint256 _proposalId) public view returns (ProposalSummary memory)
```

**Parameters:**
- `_proposalId` - The ID of the proposal

**Returns:**
- A summary of the proposal

#### `getAllProposals`

Gets all proposals.

```solidity
function getAllProposals() public view returns (ProposalSummary[] memory)
```

**Returns:**
- An array of proposal summaries

#### `getVote`

Gets the vote of a user on a proposal.

```solidity
function getVote(uint256 _proposalId, address _voter) public view returns (bool, bool, uint256)
```

**Parameters:**
- `_proposalId` - The ID of the proposal
- `_voter` - The address of the voter

**Returns:**
- Whether the user has voted, whether they supported the proposal, and their voting power

### Events

#### `ProposalCreated`

Emitted when a new proposal is created.

```solidity
event ProposalCreated(uint256 indexed proposalId, address indexed creator, string title, uint256 endTime, uint256 quorum)
```

**Parameters:**
- `proposalId` - The ID of the proposal
- `creator` - The address of the creator
- `title` - The title of the proposal
- `endTime` - The end time of the voting period
- `quorum` - The minimum number of votes required for the proposal to pass

#### `VoteCast`

Emitted when a vote is cast on a proposal.

```solidity
event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 votingPower)
```

**Parameters:**
- `proposalId` - The ID of the proposal
- `voter` - The address of the voter
- `support` - Whether the voter supported the proposal
- `votingPower` - The voting power of the voter

#### `ProposalExecuted`

Emitted when a proposal is executed.

```solidity
event ProposalExecuted(uint256 indexed proposalId)
```

**Parameters:**
- `proposalId` - The ID of the proposal

#### `ProposalCanceled`

Emitted when a proposal is canceled.

```solidity
event ProposalCanceled(uint256 indexed proposalId)
```

**Parameters:**
- `proposalId` - The ID of the proposal

