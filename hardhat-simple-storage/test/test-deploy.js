const { ethers } = require("hardhat")
const { expect, assert } = require("chai")
//takes string and a function
//each describe block has one beforeEach and many it()
//can have describes inside describes as well
describe("SimpleStorage", function () {
    let simpleStorageFactory, simpleStorage

    beforeEach(async function () {
        //first we deploy the contract
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it("Should start with favorite number of 0", async function () {
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = 0
        //assert or expect --> import from "chai"
        assert.equal(currentValue.toString(), expectedValue)
        //expect(currentValue.toString()).to.equal(expectedValue)
    })

    it("Should update when we call store()", async () => {
        const expectedValue = "7"
        await simpleStorage.store(expectedValue)
        const newValue = await simpleStorage.retrieve()
        assert.equal(newValue.toString(), expectedValue)
    })

    // to run just one test
    // yarn hardhat test --grep store
    // OR write the it as it.only(""....) --> only means only that will run
})
