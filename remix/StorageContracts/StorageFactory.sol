//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

contract StorageFactory {

    SimpleStorage[] public simpleStorageArray;

    function createSimpleStorage() public {
        simpleStorageArray.push(new SimpleStorage());    //deploy and then store all SimpleStorage deployments
    }

    function contractCount() view public returns(uint256) {
        return simpleStorageArray.length;
    }

    //what if you want to call SimpleStorage's store function from here?
    //need contract address, and ABI (ABI can be auto-gotten when importing a contract)
    function sfStore(uint256 _simpleStorageIndex, uint256 _simpleStorageFavNumber) public {
        SimpleStorage ss = simpleStorageArray[_simpleStorageIndex];

        //now because our array is of type SimpleStorage, it comes with ABI inside itself
        //if it was just an array of type 'address', we would need to --> SimpleStorage(simpleStorageArray[_simpleStorageIndex]);
        
        ss.store(_simpleStorageFavNumber);
    }

    function sfGet(uint256 _simpleStorageIndex) view public returns(uint256) {
        return simpleStorageArray[_simpleStorageIndex].retrieve();
    }
}