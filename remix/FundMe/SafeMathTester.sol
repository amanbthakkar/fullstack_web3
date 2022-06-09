//SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract SafeMathTester{

    uint8 public bigNumber = 255; //unchecked

    function add() public {
        bigNumber = bigNumber+1; //prior versions had unchecked, ints just wrapped around and restarted lol
        //0.8 and above will fail this... unless you explicitly uncheck it
        // unchecked {bigNumber = bigNumber + 1 };

        //why ever use this 'unchecked'? because it is a lil bit more gas efficient
        //so if you are absolutely sure value isn't gona out of bounds, you can use
    }
}