// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.8;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Admin.sol";
contract Corporate is AccessControl {
    Admin private roles;
    bytes32 public constant CORPORATE_ROLE = keccak256("CORPORATE_ROLE");

    address private owner;
    struct corporate {
        string id;
        uint256 created_at;
    }
    mapping(address => corporate) private corporateList;
    event addCorporateEvent(address,string,uint256);
    event deleteCorporateEvent(address,uint256);
    constructor(address RolesAddress) {
        owner = msg.sender;
        roles=  Admin(RolesAddress);
        _setupRole(roles.ADMIN_ROLE(),owner);
    }
    function addCorporate(string calldata _id, address _corporateAddress) external onlyRole(roles.ADMIN_ROLE()){
        require(corporateList[_corporateAddress].created_at == 0,"corporate does exist");
        corporateList[_corporateAddress].id = _id;
        corporateList[_corporateAddress].created_at = block.timestamp;
        _setupRole(CORPORATE_ROLE, _corporateAddress);
        emit addCorporateEvent(_corporateAddress,corporateList[_corporateAddress].id,corporateList[_corporateAddress].created_at);
    }
    function getCorporate(address _corporateAddress) external view returns(corporate memory){
        require(corporateList[_corporateAddress].created_at != 0,"corporate does not exist");
        return corporateList[_corporateAddress];
    }
    function deleteCorporate(address _corporateAddress) external onlyRole(roles.ADMIN_ROLE()) {
        require(corporateList[_corporateAddress].created_at != 0,"corporated does not exist");
        delete corporateList[_corporateAddress];
        _revokeRole(CORPORATE_ROLE,_corporateAddress);
        emit deleteCorporateEvent(_corporateAddress, block.timestamp);
    }
    


}