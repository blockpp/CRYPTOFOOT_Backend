// SPDX-License-Identifier: UNLICENCED

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Admin.sol";
pragma solidity ^0.8.8;
contract Trader is AccessControl {
    address private owner;
    bytes32 public constant TRADER_ROLE = keccak256("TRADER_ROLE");
    Admin admin;
    struct trader{
        string id;
        uint256 created_at;
    }
    mapping (address => trader) private traderList ;
    event addCorporateEvent(address , string, uint256);
    event deleteCorporateEvent(address,uint256);
    constructor(address AdminAddress) {
        owner = msg.sender;
        admin = Admin(AdminAddress);
        _setupRole(admin.ADMIN_ROLE(), owner);
    }
    function addTrader(string calldata _id, address _traderAddress) external onlyRole(admin.ADMIN_ROLE()) {
        require(traderList[_traderAddress].created_at == 0,"trader does exist");
        traderList[_traderAddress].id = _id;
        traderList[_traderAddress].created_at = block.timestamp;
        _setupRole(TRADER_ROLE, _traderAddress);
        emit addCorporateEvent(_traderAddress ,traderList[_traderAddress].id,traderList[_traderAddress].created_at);
    }
    function getTrader(address _traderAddress) external view returns (trader memory) {
        require(traderList[_traderAddress].created_at != 0,"trader does not exist");
        
        return traderList[_traderAddress];
    }
    function deleteTrader(address _traderAddress) external onlyRole(admin.ADMIN_ROLE()) {
        require(traderList[_traderAddress].created_at != 0,"corporated does not exist");
        delete traderList[_traderAddress];
        _revokeRole(TRADER_ROLE,_traderAddress);
        emit deleteCorporateEvent(_traderAddress, block.timestamp);
    }
}