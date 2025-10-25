// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InventoryStore {
    address public owner;
    uint256 public minimumPrice;
    uint256 public transferFee;

    // itemId => owner address (0 = minted but unsold)
    mapping(uint256 => address) public itemOwner;

    // itemId => minted or not
    mapping(uint256 => bool) public isMinted;

    // user => list of owned items
    mapping(address => uint256[]) public ownedItems;

    event ItemMinted(uint256 indexed itemId);
    event ItemBought(address indexed buyer, uint256 indexed itemId, uint256 amount);
    event ItemTransferred(address indexed from, address indexed to, uint256 indexed itemId, uint256 feePaid);
    event MinimumPriceUpdated(uint256 newPrice);
    event TransferFeeUpdated(uint256 newFee);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(uint256 _minimumPrice, uint256 _transferFee) {
        owner = 0xc58F0E2007B4c52597042cB212a3683AF2ABDA06;
        minimumPrice = _minimumPrice;
        transferFee = _transferFee;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    // ✅ Transfer contract ownership
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }

    // ✅ Owner mints item ID (item becomes available for sale)
    function mintItem(uint256 itemId) external onlyOwner {
        require(!isMinted[itemId], "Item already minted");
        isMinted[itemId] = true;
        itemOwner[itemId] = address(0); // Unsold
        emit ItemMinted(itemId);
    }

    // ✅ User buys an already-minted + unowned item
    function buyItem(uint256 itemId) external payable {
        require(isMinted[itemId], "Item not minted");
        require(itemOwner[itemId] == address(0), "Item already bought");
        require(msg.value >= minimumPrice, "Insufficient payment");

        itemOwner[itemId] = msg.sender;
        ownedItems[msg.sender].push(itemId);

        emit ItemBought(msg.sender, itemId, msg.value);
    }

    // ✅ Transfer ownership of item to another user (with transfer fee)
    function transferItem(address to, uint256 itemId) external payable {
        require(isMinted[itemId], "Item not minted");
        require(itemOwner[itemId] == msg.sender, "Not the owner");
        require(to != address(0), "Invalid recipient");
        require(msg.value >= transferFee, "Transfer fee required");

        _removeOwnedItem(msg.sender, itemId);

        itemOwner[itemId] = to;
        ownedItems[to].push(itemId);

        emit ItemTransferred(msg.sender, to, itemId, msg.value);
    }

    // ✅ Update minimum price (owner only)
    function updateMinimumPrice(uint256 newPrice) external onlyOwner {
        minimumPrice = newPrice;
        emit MinimumPriceUpdated(newPrice);
    }

    // ✅ Update transfer fee (owner only)
    function updateTransferFee(uint256 newFee) external onlyOwner {
        transferFee = newFee;
        emit TransferFeeUpdated(newFee);
    }

    // ✅ Withdraw contract funds (owner only)
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // ✅ Get all items owned by a user
    function getOwnedItems(address user) external view returns (uint256[] memory) {
        return ownedItems[user];
    }

    // ✅ Check if an item has been bought (has an owner)
    function isItemOwned(uint256 itemId) external view returns (bool) {
        return itemOwner[itemId] != address(0);
    }

    // Internal — remove an item from a user's list
    function _removeOwnedItem(address user, uint256 itemId) internal {
        uint256[] storage items = ownedItems[user];
        for (uint256 i = 0; i < items.length; i++) {
            if (items[i] == itemId) {
                items[i] = items[items.length - 1];
                items.pop();
                break;
            }
        }
    }
}
