const ethers = require("ethers")
const fs = require("fs")
require("dotenv").config()

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.RINKEBY_RPC_URL
  )

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
  //now we can't just pass in private key, we have encrypted key --> using private key for easiness

  //   const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8")
  //   let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //     encryptedJson,
  //     process.env.PRIVATE_KEY_PASSWORD //yes, this hasn't been saved.
  //   )
  //PRIVATE_KEY_PASSWORD=<password> node deploy.js
  //sets the env variable within terminal itself
  console.log("Wallet:" + wallet.address)

  //now we connect to provider
  //wallet = await wallet.connect(provider)

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  )

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
  console.log("Deploying...")
  const contract = await contractFactory.deploy()

  await contract.deployTransaction.wait(1)
  //console.log("Here is the transaction deployment (transaction response):");
  //console.log(contract.deployTransaction); //this is what you get after deploy command, when contract is returned
  console.log("Contract address: ${contract.address}")
  console.log(
    "=============================================================================="
  )
  const currentFavNumber = await contract.retrieve()
  console.log(`Current fav number: ${currentFavNumber.toString()}`)

  const transactionResponse = await contract.store("7")
  await transactionResponse.wait(1)

  const newFavNumber = await contract.retrieve()
  console.log(`New fav number: ${newFavNumber.toString()}`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
