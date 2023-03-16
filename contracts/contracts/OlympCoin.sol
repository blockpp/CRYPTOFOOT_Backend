// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OlympCoin is ERC20 , Ownable {
    event Mint(address, uint256, uint256);
    event Burn (address, uint256 , uint256);
    constructor(uint256 totalSupply) ERC20("OlympCoin", "OLC"){
        _mint(msg.sender, totalSupply * 1 ether);
        emit Mint(msg.sender, totalSupply , block.timestamp);
    }
    function mint(uint256 maxSupply) external onlyOwner {
        _mint(msg.sender,maxSupply * 1 ether);
        emit Mint(msg.sender, maxSupply , block.timestamp);

    }
    function burnSupply(uint256 burnedSupply) external onlyOwner {
        _burn(msg.sender, burnedSupply * 1 ether);
        emit Burn(msg.sender , burnedSupply , block.timestamp);
    }
}