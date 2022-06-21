### Installation

This time we choose advanced project with some defaults as yes. Then remove some of it lol, like `.npmignore` and the eslint stuff.

What is linting? Searches for some errors and also does a bit of formatting. Prettier also does that part.

`yarn solhint contracts/*.sol` runs it on everything. Gives good practices for running code even if no actual errors.

`yarn hardhat compile` gives an error initially, as we haven't installed chainlink stuff yet. `yarn add --dev @chainlink/contracts` Hardhat automatically will recognize this now.
