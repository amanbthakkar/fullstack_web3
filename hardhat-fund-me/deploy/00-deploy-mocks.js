const { network } = require("hardhat")
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //dont have to deploy mocks to all chains. just mark some asyarn development chains explicitly and deploy to them.
    if (developmentChains.includes(network.name)) {
        log("Local network! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            args: [DECIMALS, INITIAL_ANSWER], //takes decimals and an initial answer
            log: true,
        })
    }

    log("Mocks Deployed")
    log("============================================")
}

module.exports.tags = ["all", "mocks"]
