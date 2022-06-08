//Get funds from users
//Withdraw funds
//Set a minimum funding value in USD

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

contract FundMe {

    using PriceConverter for uint256;


    uint256 public minUSD = 50 * 1e18;

    address[] funders;
    mapping(address=>uint256) public addressToAmountFunded;


    function fund() public payable{

        require(msg.value.getConversionRate() > minUSD, "Didn't send enough!");
        //no need to pass a parameter, msg.value is considered as the first parameter.


        funders.push(msg.sender); 
        addressToAmountFunded[msg.sender] = msg.value;
    }
}