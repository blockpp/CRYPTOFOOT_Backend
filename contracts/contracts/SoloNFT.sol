// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.8;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import './Roles.sol';
contract SoloNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    event Mint(address,uint256,string,uint256);
    event Burn(uint256, uint256);
    Roles private roles;
    constructor(address rolesAddress) ERC721("CRYPTOFOOTNFT","CRNFT") {
        roles = Roles(rolesAddress);
    }
    
    function mint(address _address , string calldata tokenURI) external returns(uint256){
        require(roles.hasRole(roles.CORPORATE_ROLE(),_address),"user is not corporate");
        uint256 newItemId = _tokenIds.current();
        _safeMint(_address, newItemId);
        _setTokenURI(newItemId, tokenURI);

        _tokenIds.increment();
        emit Mint(_address,newItemId,tokenURI,block.timestamp);
        return newItemId;
    }
    function burn(uint256 _tokenId) external {
        require(roles.hasRole(roles.ADMIN_ROLE(),msg.sender), "user is not ADMIN");
        _burn(_tokenId);
        emit Burn(_tokenId, block.timestamp);
    }
   
}