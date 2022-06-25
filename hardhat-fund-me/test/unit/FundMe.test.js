const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("FundMe", function () {
    let fundMe
    let deployer
    let mockv3aggregator

    //const sendValue = 1000000000000000000 //1 ETH
    const sendValue = ethers.utils.parseEther("1")

    beforeEach(async function () {
        //deploy FundMe contract using hardhat-deploy
        //fixture runs all deploy/ scripts with the tag that is passed
        deployer = (await getNamedAccounts()).deployer

        await deployments.fixture(["all"])

        // const { deployer } = await getNamedAccounts()
        //since we need deployer again and again, we convert above line to below line

        // other ways to get different accounts:

        // remember deployer gets the account from hardhat-config.js's "namedAccounts" section

        // const accounts = ethers.getNamedSigners()
        // this gets the account from "accounts:" tag defined under every networks[rinkeby][accounts]
        // if on default hardhat, it gives list of 10 fake accounts, then we can do
        //  accountZero = accounts[0] (this will be deployer)

        // now mock and FundMe both should be deployed
        //fundMe = await deployments.get("FundMe")

        fundMe = await ethers.getContract("FundMe", deployer) //attached an account to this contract. now whenever we call a function it will be from this account!

        mockv3aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    // describe within a describe, for every kind of function
    describe("constructor", function () {
        it("sets the aggregator address correctly", async function () {
            const response = await fundMe.priceFeed() // remember public variables are actually functions?
            assert.equal(response, mockv3aggregator.address)
        })
    })

    describe("funds the contract", function () {
        it("fails if funds aren't enough", async () => {
            // now if we dont send any money, the test itself breaks
            // which is kinda goood - here is where we use waffle
            // we "expect" this transaction to be reverted

            await expect(fundMe.fund()).to.be.revertedWith(
                "Didn't send enough!"
            )
        })

        it("correctly update funder amount", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })

        it("adds funder to array of funders", async () => {
            await fundMe.fund({ value: sendValue })
            const funder = await fundMe.funders(0)
            assert.equal(deployer, funder)
        })
    })

    //now move on to withdraw()
    describe("withdraws funds to owner of contract", function () {
        // first got to fund the contract
        beforeEach(async function () {
            await fundMe.fund({ value: sendValue })
        })

        // should revert if not called by owner
        it("withdraw ETH from single founder", async function () {
            //Arrange - first note down initial balances
            const startingContractBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const startingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )

            //Act

            const transactionRespone = await fundMe.withdraw()
            const transactionReceipt = await transactionRespone.wait(1)

            //cool thing, check debugger
            //total gas cost = gas used * price of gas
            const { gasUsed, effectiveGasPrice } = transactionReceipt

            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingContractBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance = await fundMe.provider.getBalance(
                deployer
            )
            //Assert
            assert.equal(endingContractBalance, 0)
            assert.equal(
                startingContractBalance.add(startingDeployerBalance).toString(),
                endingDeployerBalance.add(gasCost).toString()
            )

            //note that these balances are from the blockchain so are big numbers
            // addition in big numbers -- num1 + num2 isn't good
            //use num1.add(num2) instead
            //this is BigNumber.add() from BigNumber package
            //similarly, .mul() for multiplication in gas cost

            //also that deployer spends some gas while calling withdraw() so that has to be accounted for as well
        })
    })
})
