// SPDX-License-Identifier: UNLICENE
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract Marketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    uint256 listingPrice = 0.0015 ether;
    address private owner;
    mapping (uint256 => MarketItem) public  IdMarketItem;

    struct  MarketItem {
        uint256 tokenId;
        address payable seller;
        address  payable owner;
        address  payable author;
        uint256 price ;
        bool sold;
    }
    event MarketItemCreated (
        uint256 index,
        address seller,
        address owner,
        address author,
        uint256 price, 
        bool sold
    );
    constructor() ERC721("CRYPTOFOOT NFT","CFNFT") {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    function updatingListingPrice(uint256 _price) 
    public 
    payable
    onlyOwner
    {
        listingPrice = _price;    
    }

    function getListingPrice() public view returns(uint256){
        return listingPrice;
    }
    // let's create NFT Token Function

    function createToken(string calldata tokenURI, uint256 price) public payable   returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender,newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        createMarketItem(newTokenId, price);
        
        return newTokenId;
    }

    // Crate Market Items
    function createMarketItem(uint256 tokenID, uint256 price ) private {
        require(price >0 , "price must be at least 1");
        require(msg.value >= listingPrice , "not enough eth" );
        IdMarketItem[tokenID] = MarketItem(
            tokenID,
            payable(msg.sender),
            payable(owner),
            payable(msg.sender),
            price * 1 ether,
            false
        );
        _transfer(msg.sender , owner, tokenID);
        emit MarketItemCreated(tokenID,msg.sender , owner ,msg.sender, price , false );

    }
    // FUNCTION FOR RESALE TOKEN
    function reSellToken(uint256 _tokenId , uint256 _price) public payable  {
        require(IdMarketItem[_tokenId].seller == msg.sender , "Only Item Owner can perform a resell");
        require(msg.value == listingPrice, "price must be equal to price");
        IdMarketItem[_tokenId].sold = false;
        IdMarketItem[_tokenId].price = _price * 1 ether;
        IdMarketItem[_tokenId].seller = payable(msg.sender);
        IdMarketItem[_tokenId].owner = payable(owner);
        _itemsSold.decrement();
        _transfer(msg.sender , owner , _tokenId);
    }
    // FUNCTION CREATEMARKETSALE
    function createMarketSell(uint256  _tokenId) public payable {
        uint256 price = IdMarketItem[_tokenId].price;
        require(msg.value == price , "please submit the asking price in order");
        IdMarketItem[_tokenId].owner = payable(msg.sender);
        IdMarketItem[_tokenId].sold = true;
        IdMarketItem[_tokenId].owner =  payable(msg.sender);

        _itemsSold.increment();
        _transfer(owner , msg.sender , _tokenId);
        payable(owner).transfer(listingPrice);
        payable(IdMarketItem[_tokenId].seller).transfer(msg.value);
    }
    
    // GETTING UNSOLD NFT DATA
    function fetchMarketItem() public view returns(MarketItem[] memory){
        uint256 itemCount = _tokenIds.current();
        uint256 unsoldItems = _tokenIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItems);
        for(uint256 i = 1;  i <= itemCount ; i++){
            if(IdMarketItem[i].owner == owner){
                uint256 currentID = i;
                MarketItem memory  currentItem = IdMarketItem[currentID];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }
    // PURCHASED ITEMS
    function fetchMyNFT() public view returns (MarketItem[] memory) {
        uint256 totalCount  = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;
        for(uint256 i = 0;  i< totalCount ; i++){
            if(IdMarketItem[i+1].owner == msg.sender){
                itemCount++;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalCount ;  i++) {
            if(IdMarketItem[i + 1].owner == msg.sender)
            {
                uint256 currentId = i+1;
                MarketItem  storage currentItem = IdMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex+=1;   
            }
        }
        return items; 
    }

    // SINGLE USER ITEM
    function fetchItemsListed() public view  returns (MarketItem[] memory) {
        uint256 totalCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i <  totalCount; i++) {
            if(IdMarketItem[i  + 1 ].seller == msg.sender){
                itemCount++;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalCount; i++) {
            if(IdMarketItem[i+1].seller == msg.sender){
                uint256 currentId = i++;
                MarketItem storage currentItem = IdMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }
}