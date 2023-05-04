// SPDX-License-Identifier: UNLICENCED
pragma solidity ^0.8.8;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Roles is Ownable , AccessControl{

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant TRADER_ROLE = keccak256("TRADER_ROLE");
    bytes32 public constant CORPORATE_ROLE = keccak256("CORPORATE_ROLE");
    constructor(){
        
    }
    
}