const { ethers, run, network } = require("hardhat") //can import from ethers as well
//but now hardhat also has an ethers wrapper, can use alongside if imported from hardhat
//ethers itself doesnt know about the folder setup & compiled contracts
/*
in hardhat we can grab the complied contract in a bunch of different ways
-using ethers
*/
require("@nomiclabs/hardhat-etherscan")
require("dotenv")

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()
    console.log(`Deployed contract to ${simpleStorage.address}`)
    //that's it! no RPC, wallet defined as in ethers. how?
    //there is a default network that always runs when u run something

    //now we verify contracts - but wait, that's only necessary if network is on etherscan
    //so import {network} and use chainIds to figure out if a network is live or not
    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        //if rinkeby and api exists then -->

        //but etherscan may take a moment to recognize that a contract is deployed

        await simpleStorage.deployTransaction.wait(6) //so wait 6 blocks
        await verify(simpleStorage.address, []) //and then verify the contract! defined below
    }

    //now lets interact with the contract
    const currentValue = await simpleStorage.retrieve()
    console.log("Current value is ", currentValue.toString())

    //update current
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)

    //retrieve new
    const newValue = await simpleStorage.retrieve()
    console.log("New value is: ", newValue.toString())
}

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
