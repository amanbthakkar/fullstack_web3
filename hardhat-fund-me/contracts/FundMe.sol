//Get funds from users
//Withdraw funds
//Set a minimum funding value in USD

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./PriceConverter.sol";

contract FundMe {
    using PriceConverter for uint256;

    uint256 public minUSD = 50 * 1e18;

    address[] public funders; //can optimize to check if funder is already present in array
    mapping(address => uint256) public addressToAmountFunded;

    address public owner;

    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress) {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(priceFeed) > minUSD,
            "Didn't send enough!"
        ); //this time pass priceFeed as a parameter to the library

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    //now we want these deposited funds to be withdrawable
    function withdraw() public onlyOwner {
        // require(msg.sender == owner, "Sender is not owner!");
        // ^ this line is obsolete by onlyOwner

        //reset funds to zero
        for (uint256 i = 0; i < funders.length; i++) {
            address funder = funders[i];
            addressToAmountFunded[funder] = 0; //update mapping to 0 for all funders
        }

        //now reset the array
        funders = new address[](0);

        //now withdraw the funds --> there are 3 different ways

        //1.transfer
        payable(msg.sender).transfer(address(this).balance);

        bool sendSuccess = payable(msg.sender).send(address(this).balance);
        require(sendSuccess, "Sending failed!");

        (bool callSuccess, bytes memory dataReturned) = payable(msg.sender)
            .call{value: address(this).balance}("");

        require(callSuccess, "Call failed!");
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Sender is not owner!");
        _;
    }
}
