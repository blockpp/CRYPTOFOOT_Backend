// SPDX-License-Identifier: UNLICENCED
pragma solidity ^0.8.8;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract Admin is Ownable , AccessControl {

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct admin {
        string id;
        uint256 created_at;
    }
    mapping (address => admin) adminList;
    constructor( ) {
    }
    function addAdmin(string calldata _id, address  _address)external onlyOwner {
        require(adminList[_address].created_at == 0,"Admin does exist");
        adminList[_address].id = _id;
        adminList[_address].created_at = block.timestamp;
        _setupRole(ADMIN_ROLE,_address);
    }
    function deleteAdmin(address _address) external onlyOwner {
        delete adminList[_address];       
        _revokeRole(ADMIN_ROLE,_address);

    }
    function getAdmin(address _address) external onlyRole(ADMIN_ROLE) view returns(admin memory){
        require(adminList[_address].created_at != 0,"Admin does not exist");
        return adminList[_address];
    }
    
}