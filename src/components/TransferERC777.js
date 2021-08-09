import React from 'react';
import Web3 from 'web3';

import { contractAddr } from '../properties/contractAddr';

const web3 = new Web3(window.web3.currentProvider);
const { abi } = require('../abi/ERC777.json');

const contract = new web3.eth.Contract(abi, contractAddr.T777R);
const acct2 = contractAddr.Acct2;

const ONBOARD_TEXT = 'Transfer T777R';

// const testPayableContract = web3.eth.connect()

function TransferERC777() {
  const [buttonText] = React.useState(ONBOARD_TEXT);
  const [isDisabled] = React.useState(false);

  let acc = [];

  function ivkContractFuncBySEND(acct) {
    contract.methods
      .transfer(acct2, web3.utils.toWei('100', 'ether'))
      .send({
        from: acct,
        // value: web3.utils.toHex(web3.utils.toWei('100', 'gwei')),
        gasPrice: web3.utils.toHex(web3.utils.toWei('100', 'gwei')),
        // gas: web3.utils.toHex(42000),
        chainId: 4,
        data: ''
      })
      .then(console.log);
  }

  const onClick = () => {
    // Sending Ethereum to an address
    acc = window.ethereum.request({ method: 'eth_requestAccounts' });
    acc.then((result) => ivkContractFuncBySEND(result[0]));
  };
  return (
    <button disabled={isDisabled} onClick={onClick}>
      {buttonText}
    </button>
  );
}

export default TransferERC777;