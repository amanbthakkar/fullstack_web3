//get current block number of whatever blockchain we are working with
const { task } = require("hardhat/config")

//define a task by giving name and description
task(
    "block-number",
    "Prints the current block number of whichever chain you are on"
).setAction(
    //note: no name functions are called anonymous functions
    async (taskArgs, hre) => {
        const blockNumber = await hre.ethers.provider.getBlockNumber()
        console.log(`Current block is ${blockNumber}`)
    }
)

module.exports = {}
