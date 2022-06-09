//Get funds from users
//Withdraw funds
//Set a minimum funding value in USD

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol"; //import this, and get the ABI

contract FundMe {


    AggregatorV3Interface priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e); 
    
    //so the ChainLink contract has already been deployed. We call it priceFeed in our code. 
    //2 main functions - fund() and withdraw()

    uint256 public minUSD = 50 * 1e18;

    address[] funders;
    mapping(address=>uint256) public addressToAmountFunded;


    function fund() public payable{
        //minimum fund amount should be there ('value' parameter)
        //payable in ether or any native EVM token
        //msg.value is a global keyword used to check what is the value sent in a txn

        require(getConversionRate(msg.value) > minUSD, "Didn't send enough!");

        /*if false, the transaction is reverted and leftover gas is sent back.
        that means any operations before require will use gas, but that state will not be saved on the chain
        any values set will be reverted. however since that computation was initially done, that gas is gone. */

        funders.push(msg.sender); //this sender value is always available
        addressToAmountFunded[msg.sender] = msg.value;
    }

    //so we'll need to actually get the price of token first
    function getPrice() public view returns (int) {
        //need to use chainlink data feeds
        //now since we are interacting with a contract, we need its ABI and address
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData(); //if you want just one of many things returned
        return uint256(price * 1e10);
        //remember this is price of ETH in USD (with 8 decimal places, as per their convention)
    }

    function getConversionRate(uint256 ethAmount) public view returns(uint256) {
        uint256 ethPrice = getPrice();
        uint256 ethAmountInUSD = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUSD;
    }

}