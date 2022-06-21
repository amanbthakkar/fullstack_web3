## Hardhat Project

### Setup

`yarn init`

delete `main` line from `package.json`

`yarn add --dev hardhat`

Dependencies are required to actually run the project, and dev dependencies are required just during development phase.

`yarn = npm`\
`yarn = npx` also (thank god lol)\
We will choose `Create a basic sample project`.

Some node modules start with `@`. What are they?\
They are called "scoped packages". You know which packages are official and which are not. `@angular` packages are published by the core Angular team. `@nomiclabs` is the team that created hardhat.

After `yarn hardhat compile` you get an `artifacts` folder that has all relevant compilation information.

`yarn hardhat` should now give a list of options that you can use with hardhat. If it doesn't come up, likely your `hardhat.config.js file` is installed in the wrong folder. Run `yarn hadhat --verbose` to find out where it is (maybe in a parent folder instead of current) and delete it.
Also don't forget to run `yarn install` if taking code from elsewhere and it isn't running on local.

`yarn add --dev prettier prettier-plugin-solidity` because the semicolons were driving Patrick nuts lol

---

Hardhat has inbuilt network tool called https://hardhat.org/hardhat-network

`yarn hardhat run scripts/deploy.js --network hardhat` you can specify the network everytime, but in general defaultNetwork is hardhat. Added `defaultNetwork: "hardhat",` to `hardhat.config.js` as well.

Remember verifying and deploying our contract on etherscan? Now no need to do it like a pleb through there. Just make a `function verify()`. Also check the "verify contracts programatically" section on etherscan. Hardhat though, makes it easier with plugins. Just do `yarn add --dev @nomiclabs/hardhat-etherscan`. Add this to requirements in `hardhat.config.js` as well.

Now after adding your api key from etherscan, you can `yarn hardhat` to see that there is a brand new `verify` command!.

Don't want to run this on a network that isn't live right? Import `network` and this is what `network.config` contains when you run on hardhat's network.

```
Deployed contract to 0x5FbDB2315678afecb367f032d93F642f64180aa3
{
  hardfork: 'arrowGlacier',
  blockGasLimit: 30000000,
  gasPrice: 'auto',
  chainId: 31337,
  throwOnTransactionFailures: true,
  throwOnCallFailures: true,
  allowUnlimitedContractSize: false,
  mining: { auto: true, interval: 0, mempool: { order: 'priority' } },
  accounts: {
    initialIndex: 0,
    count: 20,
    path: "m/44'/60'/0'/0",
    passphrase: '',
    mnemonic: 'test test test test test test test test test test test junk',
    accountsBalance: '10000000000000000000000'
  },
  loggingEnabled: false,
  gasMultiplier: 1,
  minGasPrice: <BN: 0>,
  chains: Map(4) {
    1 => { hardforkHistory: [Map] },
    3 => { hardforkHistory: [Map] },
    4 => { hardforkHistory: [Map] },
    42 => { hardforkHistory: [Map] }
  },
  gas: 30000000,
  initialDate: '2022-06-18T14:11:46.349Z'
}
```

`chainId` is 31337. Can be used to see what is local and what is live.

Sample verified contract deployment output:

```
~/development/fullstack_web3/hardhat-simple-storage$ yarn hardhat run scripts/deploy.js --network rinkeby
yarn run v1.22.15
$ /home/aman/development/fullstack_web3/hardhat-simple-storage/node_modules/.bin/hardhat run scripts/deploy.js --network rinkeby
Compiled 1 Solidity file successfully
Deploying contract...
Deployed contract to 0xc8928bc176540efEe4Cd9Eae99f36234dBE6F630
Verifying contract...
Nothing to compile
Successfully submitted source code for contract
contracts/SimpleStorage.sol:SimpleStorage at 0xc8928bc176540efEe4Cd9Eae99f36234dBE6F630
for verification on the block explorer. Waiting for verification result...

Successfully verified contract SimpleStorage on Etherscan.
https://rinkeby.etherscan.io/address/0xc8928bc176540efEe4Cd9Eae99f36234dBE6F630#code
Current value is  0
New value is:  7
```

---

### Tasks

`yarn hardat` gives a list of tasks. You can add your own as well. The `accounts` task is defined in hardhat config file itself. However you can delete it from there. People usually make a new folder for tasks.

What all can you do with tasks? You can set parameters and actions. https://hardhat.org/guides/create-task

So whats `hre`? Hardhat Runtime Environment. It is passed to the tasks.
It is like the hardhat in `require(hardhat)` so has access to these kinds of functions. So you can do stuff like `hre.ethers.somethingsomething`

Don't forget to import in config file. And oh - add a `module.exports = {}` so that you can import it!

---

Now what if you want to have your hardhat network/environment live past the duration of a script?

You run `yarn hardhat node` which spins up a separate, kinda persistent runtime env (hardhat only, but different from the defaultNetwork one). It comes prepackaged with some private keys and wallets, and a localhost url. You can then add this to config file!

Tip: `yarn hardhat console --network xyz`

---

### Tests

`yarn hardhat clean` clears cache and removes artifacts folder.

Tests - `mocha` for hardhat. The code is self explanatory to a point.

We can even start testing how much gas our code costs! `yarn add hardhat-gas-reporter --dev`\
Go to config and add a `gasReporter` section now. After enabling by default, you get something like this when you run `yarn hardhat test` -->

```
hardhat-simple-storage$ yarn hardhat test
yarn run v1.22.15
$ /home/aman/development/fullstack_web3/hardhat-simple-storage/node_modules/.bin/hardhat test

  SimpleStorage
    ✓ Should start with favorite number of 0
    ✓ Should update when we call store()

·----------------------------|----------------------------|-------------|-----------------------------·
|    Solc version: 0.8.8     ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 30000000 gas  │
·····························|····························|·············|······························
|  Methods                                                                                            │
··················|··········|··············|·············|·············|···············|··············
|  Contract       ·  Method  ·  Min         ·  Max        ·  Avg        ·  # calls      ·  eur (avg)  │
··················|··········|··············|·············|·············|···············|··············
|  SimpleStorage  ·  store   ·           -  ·          -  ·      43746  ·            1  ·          -  │
··················|··········|··············|·············|·············|···············|··············
|  Deployments               ·                                          ·  % of limit   ·             │
·····························|··············|·············|·············|···············|··············
|  SimpleStorage             ·           -  ·          -  ·     473840  ·        1.6 %  ·          -  │
·----------------------------|--------------|-------------|-------------|---------------|-------------·

  2 passing (3s)

Done in 9.52s.
```

---

### Solidity coverage

Goes through all tests and sees how many lines of code are covered.
Remember all libraries installed are added in config.

`yarn add --dev solidity-coverage` --> then run `yarn hardhat coverage`

And now we finally talk about `require("@nomiclabs/hardhat-waffle")`. What's this?

Waffle is a testing framework. Really advanced testing.
