const { networkConfig } = require("../helper-hardhat-config")
const { network } = require("hardhat")

// in hardhat-deploy, there is no main() that is written and then called.
// it actually calls a function that we export => OR we can export an anonymous function directly from module.exports!

// pass hre (hardhat runtime environment as parameter here)
// whenever we run deploy, hardhat-deploy calls this function and automatically passes hre to it
// in the simple-storage, we imported stuff from require("hardhat") --> similarly here we take what we need from hre

// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre
//      this is simlar to hre.deployments
// }

// Now - in case of JS, you can use synctactic sugar and even extrapolate it right in function params (like in React)

module.exports = async ({ getNamedAccounts, deployments }) => {
    //now take further stuff from here
    const { deploy, log } = deployments //2 functions taken from deployments
    const { deployer } = await getNamedAccounts() //add namedAccounts to hardhat config (get the deployer account from there)
    const chainId = network.config.chainId

    // when going for localhost/hardhat we gonna use a mock
    // but also dont wanna change code when switching networks (different networks have different price feed contracts)
    // a good way to do that is pass it to FundMe.sol constructor!

    //use chainId to set the price feed address (aave's github has this!)

    const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

    // for those networks that don't have a price feed, we create mock contracts
    // first check if they are already created and if not, create a minimal version for local testing
    // and technically deploying a mock is a deploy script

    const fundMe = await deploy("FundMe", {
        from: deployer, //who's deploying?
        args: [ethUsdPriceFeedAddress], //list of constructor args
        log: true, //custom logging
    })
}
