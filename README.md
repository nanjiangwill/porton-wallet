# porton-wallet

```
git clone <url> --recursive

or 

git clone <url>
git submodule update --init --recursive
```

## contracts

```
cd contracts
forge test
```

### vscode settings

```js
{
  "solidity.remappings": [
    "@eth-infinitism/account-abstraction/=contracts/lib/account-abstraction/",
    "@openzeppelin/=contracts/lib/openzeppelin-contracts/",
    "account-abstraction/=contracts/lib/account-abstraction/contracts/",
    "ds-test/=contracts/lib/forge-std/lib/ds-test/src/",
    "forge-std/=contracts/lib/forge-std/src/"
  ],
  "editor.formatOnSave": false
}
```