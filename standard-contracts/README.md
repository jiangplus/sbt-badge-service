# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```


### 验证合约

npx hardhat verify --network fuji  --contract contracts/Mintable.sol:Mintable <address> "SuperToken" "SuperToken" "http://google.com/"

npx hardhat verify --network fuji  --contract contracts/NameRegistry.sol:NameRegistry 0x

npx hardhat verify --constructor-args arguments.js --network fuji  --contract contracts/NameRegistry.sol:NameController 0x

npx hardhat verify --network fuji  --contract contracts/NameRegistry.sol:NamePriceOracle 0x 10000000000

### arguments.js

```
module.exports = [
  "0x",
  5,
  "0x",
  "0x",
  "0x",
  [ 50, 50, 50, 20, 20, 5 ],
  [ 5 ],
];
```
