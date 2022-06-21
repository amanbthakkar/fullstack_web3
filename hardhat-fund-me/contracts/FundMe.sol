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

    constructor() {
        //called immediately after contract is deployed
        //withdraw() should be called by owner only.abi
        owner = msg.sender;
    }

    function fund() public payable {
        require(msg.value.getConversionRate() > minUSD, "Didn't send enough!");
        //no need to pass a parameter, msg.value is considered as the first parameter.

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    //now we want these deposited funds to be withdrawable
    function withdraw() public onlyOwner {
        //require(msg.sender == owner, "Sender is not owner!");

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
        /*
        for any address to be able to receive funds, it has to be "payable address"
        normal addresses are "address", payable addresses are "payable address"
        thus typecasting is required for msg.sender

        also, address(this) --> 'this' refers to the whole smart contract.
        throws error if fails & automatically reverts
        */

        //2.send
        bool sendSuccess = payable(msg.sender).send(address(this).balance);
        require(sendSuccess, "Sending failed!");
        /*
        this one returns a bool and not an error (check explainer for links)
        send() only reverts transaction if we add the require() statement
        remember how require() works? gas is used already for computation that has happened, but state is not saved
        */

        //3. call - lower level command, v powerful
        (bool callSuccess, bytes memory dataReturned) = payable(msg.sender)
            .call{value: address(this).balance}("");
        /*
        call() is actually lower level stuff that allows us to call anything 
        it returns 2 variables
        call() allows us to actually call different functions, so if that function
        returns some data, it goes into bytes dataReturned  
        bytes object is array, so needs to be memory
        since we aren't calling a function here, we can leave it as 
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");

        also call doesn't have a capped amount of gas
        this is actually the recommended way to send tokens
        */
        require(callSuccess, "Call failed!");
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Sender is not owner!");
        _;
    }
}
