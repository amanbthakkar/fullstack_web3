//Get funds from users
//Withdraw funds
//Set a minimum funding value in USD

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FundMe {
    //2 main functions - fund() and withdraw()

    function fund() public payable{
        //minimum fund amount should be there ('value' parameter)
        //payable in ether or any native EVM token
        //msg.value is a global keyword used to check what is the value sent in a txn

        require(msg.value > 1e18, "Didn't send more than 1 ETH!");

        /*if false, the transaction is reverted and leftover gas is sent back.
        that means any operations before require will use gas, but that state will not be saved on the chain
        any values set will be reverted. however since that computation was initially done, that gas is gone. */
    }

}