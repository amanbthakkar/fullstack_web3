# Chainlink ETH data feeds, price, and sending ETH

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

## SafeMath library

Used in a ton of places before solidity version 0.8. `SafeMathTester.sol` has an explanation.

---
## Sending ether - 3 methods

Found here: [solidity-by-example.org/sending-ether](https://solidity-by-example.org/sending-ether)

### `transfer()`
`payable(msg.sender).transfer(address(this).balance);`

For any address to be able to receive funds, it has to be "payable address".\
Normal addresses are "address", payable addresses are "payable address".\
Thus typecasting is required for `msg.sender`.

Also, `address(this)` --> 'this' refers to the whole smart contract.\
Throws error if fails & automatically reverts.
        

### `send() `
```
bool sendSuccess = payable(msg.sender).send(address(this).balance);
require(sendSuccess, "Sending failed!");
```

This one returns a `bool` and not an error 
`send()` only reverts transaction if we add the `require()` statement\
Remember how `require()` works? **Gas is used already for computation that has happened, but state is not saved on the blockchain** 
        

### `call()` - lower level command, v powerful 
```
(bool callSuccess, bytes memory dataReturned) = payable(msg.sender).call{value: address(this).balance}("");
require(callSuccess, "Call failed!");
```

`call()` is actually lower level stuff that allows us to call anything (even used for calling contracts without ABIs, discussed later)\
It returns 2 variables.

`call()` allows us to actually call different functions, so if that function
returns some data, it goes into `bytes dataReturned`

bytes object is array, so needs to be `memory`
since we aren't calling a function here, we can leave it as 
`(bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");` as we don't care about what is returned.

Also `call` doesn't have a capped amount of gas.\
It is actually the recommended way to send tokens.

---

## Constructors and Modifieres

```
constructor(){
        owner = msg.sender;
    }
```

Constructors are called immediately after contract is deployed. 
`require(msg.sender == owner, "Sender is not owner!");` ensures that owner only can withdraw.

What if we have many requires in many different functions? Its a pain to include everywhere. This is where we use modifiers.

```
modifier onlyOwner{      
    require(msg.sender == owner, "Sender is not owner!");
    _;
}
```

Hey function! Do whatever is in the modifier first, and then do whatever is in the `_;`.\
If `require()` was below `_`;, first the function would exectute and `require()` would be at the end!

View transactions here: https://rinkeby.etherscan.io/address/0xd3ca65bdf85d9240fd297154df3f86bb0ba9b432
