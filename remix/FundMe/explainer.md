# Chainlink ETH data feeds

Rinkeby contract address: `0x8A753747A1Fa494EC906cE90E9f37563A8AF630e` \
Source: https://docs.chain.link/docs/ethereum-addresses/ \
Remember we need ABI + contract address to interact with contract.

### How do we get the ABI? 
In `SimpleStorage` we imported entire contract into our code.\
Now ABI is actually just a kind of list of stuff that you can interact with in the contract. Kinda like the skeleton.\
And... technically you can interact without the ABI as well, but that's for later.

### So what do you do? Interfaces.
Interface has the function declarations but none of the logic.
If you compile this, you get the ABI of the contract! 
So technically, you can use the interface name *instead of actual contract name* to get to the actual contract. 
This helps so that you don't need to import the whole contract while using it.

`AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e)`

Combination of these 2 (ABI + address) give us the AggregatorV3 Contract.\
And then we can call functions on it! The ones specified in the interface. Like `.version()` here.

So now you can simply do `import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";` to import the interface instead of the whole contract and proceed as normal.\
This is actually importing from github (refers to NPM package).\
And where from github? Here: https://github.com/smartcontractkit/chainlink/tree/develop/contracts/src/v0.8/interfaces. Remix imports this.

## What after you get the price?
- The price returned by price feed is in USD. But it has no decimals. But it is supposed to be till 8 decimal places.
- 1 wei is 10^-18 of an eth. 1 gwei is hence 10^-9.
- Remember that we want these two to be in same units, as we have to deal with min price in USD.
- Also remember that there are no decimals and fractions in solidity.

The math is supposed to be clearer with hardhat.

---

Also note that certain values are globally available - like `msg.sender` and `msg.value`. \
Full list here: https://docs.soliditylang.org/en/v0.8.10/units-and-global-variables.html.

---
## Code is a bit messy, use libraries?

You can actually transform `getConversionRate()` from a method to be called to a property of `uint256` itself. That way it can me used like `msg.value.getConversionRate()` instead of `getConversionRate()`! This helps up in cleaning the code. 

Libraries can't have state variables and can't send eth. All library functions are `internal`. 

For `uint256` library, the value on which this library is applied is considered as the first parameter to the function being called. 

For example, `msg.value.library_function()` might be taking a `uint256` as a parameter, which will be  `msg.value` itself.