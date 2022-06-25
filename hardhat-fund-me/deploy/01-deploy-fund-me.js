const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")

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
    const { deployer } = await getNamedAccounts() //added namedAccounts to hardhat config (get the deployer account from there)
    const chainId = network.config.chainId

    // when going for localhost/hardhat we gonna use a mock
    // but also dont wanna change code when switching networks (different networks have different price feed contracts)
    // a good way to do that is pass it to FundMe.sol constructor!

    //use chainId to set the price feed address (aave's github has this!)

    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

    let ethUsdPriceFeedAddress

    if (developmentChains.includes(network.name)) {
        //00- script has deployed the mock already, now we need to get it here
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address //now the pricefeed is the contract we deployed
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    log(`ETH-USD price feed for ${network.name} is ${ethUsdPriceFeedAddress}`)

    // for those networks that don't have a price feed, we create mock contracts
    // first check if they are already created and if not, create a minimal version for local testing
    // and technically deploying a mock is a deploy script
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer, //who's deploying?
        args: args, //list of constructor args
        log: true, //custom logging
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log("Contract has been deployed.")
    //////////////////////////////////////////////////////////////////////////////////
    test = await deployments.get("FundMe")
    log(`test: ${test.address}`)
    /////////////////////////////////////////////////////////////////////////////////

    // lets also verify the contract if not local network
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("--- Contract verification step---")
        await verify(fundMe.address, args)
    }

    log(
        "========================================================================"
    )
}

module.exports.tags = ["all", "fundme"]
