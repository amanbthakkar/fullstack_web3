//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

contract ExtraStorage is SimpleStorage{
    /*once inheriting, even blank contract deployed gets all the functionality of original

    what if we dont like one of the functions and want to change it? override it
    2 keywords -> virtual and override

    in order for a function to be overridable, go back and add 'virtual' keyword to original 
    and 'override' to the new one */

    //we want to store favnumber+7 instead
    function store(uint256 _favoriteNumber) public override {
        favoriteNumber = _favoriteNumber+7; //we already have access to it in the contract
    }

}