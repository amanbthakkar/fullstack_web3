/*
sometimes storing private keys even in .env is scary, what if we accidentally upload?
for that we can store the encrypted version instead
*/
const ethers = require("ethers")
const fs = require("fs")
require("dotenv").config()

async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
  //create wallet once

  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD,
    process.env.PRIVATE_KEY
  )
  //returns encrypteJsonKey that can be stored locally and only decrypted with password
  console.log(encryptedJsonKey)
  //once encrypted, we save it
  fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
