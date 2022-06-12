"scripts": {
"compile": "yarn solcjs --bin --abi --include-path node_modules/ --base-path . -o . SimpleStorage.sol"
}

saves trouble of having to type all the stuff for every compilation

yarn add solc@0.8.7-fixed - as there was issue initially

ethers.js and web3.js provide ways to intereact with blockchain
ethers powers hardhat environment
