// SPDX-License-Identifier: unlicenced
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TraderContract is AccessControl {
    address private owner;
        bytes32 public constant TRADER_ROLE = keccak256("TRADER_ROLE");

    struct trader {
        bytes32 name ;
        bytes32 prenom;
        uint256 balance;
        uint256 created_at;
    }
    mapping (address => trader) private traderList;    
    constructor() {
        owner = msg.sender;
    }

    function addUser(string memory name, string memory prenom , uint256 balance) external {
        require(traderList[msg.sender].created_at ==0, "user does exist");
        traderList[msg.sender].name = bytes32(abi.encodePacked(name));
        traderList[msg.sender].prenom = bytes32(abi.encodePacked(prenom));
        traderList[msg.sender].balance = balance;
        traderList[msg.sender].created_at = block.timestamp;
    }
    

}