// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract AdminContract is AccessControl {
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant CORPORATE_ROLE = keccak256("CORPORATE_ROLE");

    struct User {
        string name;
        string email;
        bool validated;
    }

    mapping(address => User) private users;
    mapping(address => address[]) private tradersByAdmin;
    mapping(address => address[]) private corporatesByAdmin;
    address[] private admins;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
        admins.push(msg.sender);
    }

    function addUser(string memory name, string memory email) public {
        require(users[msg.sender].validated == false, "User is already registered and validated");
        User memory newUser = User(name, email, true);
        users[msg.sender] = newUser;
    }

    function addCorporate(address corporateAddress) public onlyRole(ADMIN_ROLE) {
        require(hasRole(CORPORATE_ROLE, corporateAddress) == false, "Corporate is already added");
        grantRole(CORPORATE_ROLE, corporateAddress);
        address adminAddress = msg.sender;
        corporatesByAdmin[adminAddress].push(corporateAddress);
    }

    function deleteCorporate(address corporateAddress) public onlyRole(ADMIN_ROLE) {
        revokeRole(CORPORATE_ROLE, corporateAddress);
        address adminAddress = msg.sender;
        address[] storage corporates = corporatesByAdmin[adminAddress];
        for (uint i = 0; i < corporates.length; i++) {
            if (corporates[i] == corporateAddress) {
                corporates[i] = corporates[corporates.length - 1];
                corporates.pop();
                break;
            }
        }
    }

    function getAllCorporates() public view returns (address[] memory) {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        return corporatesByAdmin[msg.sender];
    }

    function deleteUser(address userAddress) public onlyRole(ADMIN_ROLE) {
        delete users[userAddress];
    }

    function updateUserEmail(address userAddress, string memory newEmail) public onlyRole(ADMIN_ROLE) {
        users[userAddress].email = newEmail;
    }

    function updateUserValidationStatus(address userAddress, bool validationStatus) public onlyRole(ADMIN_ROLE) {
        users[userAddress].validated = validationStatus;
    }

    function getUser(address userAddress) public view returns(User memory) {
        return users[userAddress];
    }

    function getAdmin() public view returns(User memory) {
        address adminAddress = admins[0];
        return users[adminAddress];
    }

    function getAllTraders() public view returns (address[] memory) {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        return tradersByAdmin[msg.sender];
    }

    function getAdminTraders() private view returns (address[] memory) {
        return tradersByAdmin[msg.sender];
    }

}
