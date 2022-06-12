//final wrapping up of code without comments will be in deploy.js, with modularity and env rariables!

const ethers = require("ethers")
const fs = require("fs")

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  )
  //Step 1: create the wallet

  const wallet = new ethers.Wallet(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", //0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    provider
  )
  console.log("Wallet:" + wallet.address)

  //Step 2: in order to deploy we will need abi and binary of compiled contract
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  )

  //Step 3: deploy -> using ContractFactory.
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
  console.log("Deploying...")
  const contract = await contractFactory.deploy()
  //deploy function returns a promise that resolves to a contract
  // const transactionReceipt =
  await contract.deployTransaction.wait(1)
  //wait for one block confirmation - you only get transaction receipt when you wait for a block confirmation
  console.log("Here is the transaction deployment (transaction response):")
  console.log(contract.deployTransaction) //this is what you get after deploy command, when contract is returned
  console.log(
    "=============================================================================="
  )
  //   console.log("Here is the transaction receipt:");
  //   console.log(transactionReceipt);
  console.log(
    "=============================================================================="
  )

  //Now we can learn how to interact with the deployed contract.

  const currentFavNumber = await contract.retrieve() //was passed abi while creating, so you can do stuff
  //no gas as view function
  console.log(currentFavNumber)

  //whoa - this comes as a big number! solidity doesn't have decimals so ethers does this
  //https://docs.ethers.io/v5/api/utils/bignumber/
  //so we want to use big numbers or strings while working with ethers
  console.log(`Current fav number: ${currentFavNumber.toString()}`)

  //now lets update it
  const transactionResponse = await contract.store("7")
  //small numbers can be passed as ints as well
  //but larger numbers are passed as strings otherwise JS will get confused
  //hence best practice is to pass all as strings

  await transactionResponse.wait(1) //note this is a different syntax to wait as the one on line 29 after deployment

  const newFavNumber = await contract.retrieve()
  console.log(`New fav number: ${newFavNumber.toString()}`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
