### Installation

This time we choose advanced project with some defaults as yes. Then remove some of it lol, like `.npmignore` and the eslint stuff.

What is linting? Searches for some errors and also does a bit of formatting. Prettier also does that part.

`yarn solhint contracts/*.sol` runs it on everything. Gives good practices for running code even if no actual errors.

`yarn hardhat compile` gives an error initially, as we haven't installed chainlink stuff yet. `yarn add --dev @chainlink/contracts` Hardhat automatically will recognize this now.

Now, the previous project had a deploy script. But that is very primitive technique. Inefficient, and not the best compatibility with tasks. Now we shall use `yarn add hardhat-deploy`. Makes some things very easy. Now instead of writing deploy scripts in `scripts/`, we make a `deploy/` folder. Finally, we also want to install `hardhat-deploy-ethers`.

Its kinda weird -- `yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers`.

It takes `hardhat-ethers` which we have used before, and overrides it with `hardhat-deploy-ethers`. Previous one we used `hardhat-ethers` to override simple `ethers`, and now we're overriding that as well for easier ways to deploy. Check the `package.json` once.

Now if we run `yarn hardhat deploy`, all scripts added to `deploy/` will run. Number them so they run in order.

---

Now, while deploying - what's the issue? We can't possibly deploy to Rinkeby everytime. But in `PriceConverter.sol` there is a hard-coded reference to ETH-USD price contract on Rinkeby! What if we want to do it on the hardhat network?

2 ways. First, you can fork the whole blockchain and keep the address as is. That we will do later. Second, you can use mocks!

Now you can set pricefeed address by using conditions based on chainId. Aave's github (github.com/aave/aave-v3-core) has this. Check `helper-hardhat-config.ts`.

Taking a leaf out of their notebook, we create a new file called `helper-hardhat-config.js`.

Can we run only mock deployment script and not the FundMe deployment script?
