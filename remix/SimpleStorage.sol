// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7; //^ indicates higher versions are OK

contract SimpleStorage{
    uint256 public favoriteNumber; //default is null value, which for ints is 0
    //default visibility is internal

    People[] public people;

    //People public person1 = People({favoriteNumber: 3,name :"Aman"});

    struct People {
        uint256 favoriteNumber;
        string name;
    }

    mapping(string => uint256) nameToFavoriteNumber; //like a dictionary of sorts
    //initially all strings to 0

    function store (uint256 _favoriteNumber) public {
        favoriteNumber = _favoriteNumber;
    }

    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        people.push(People(_favoriteNumber, _name));
        nameToFavoriteNumber[_name] = _favoriteNumber; 
    }
}