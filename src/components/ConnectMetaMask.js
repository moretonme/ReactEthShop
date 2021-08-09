import MetaMaskOnboarding from '@metamask/onboarding';
import React from 'react';
import { styled } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const ONBOARD_TEXT = 'Click here to install MetaMask!';
const CONNECT_TEXT = 'Connect';
const CONNECTED_TEXT = 'Connected';
let NET_NAME = 'UNKNOWN';

function ConnectMetaMask() {
  const [buttonText, setButtonText] = React.useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  const onboarding = React.useRef();

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  React.useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(`${CONNECTED_TEXT} to ${NET_NAME}`);
        setDisabled(true);
        onboarding.current.stopOnboarding();
      } else {
        setButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, [accounts]);

  React.useEffect(() => {
    function handleNewAccounts(newAccounts) {
      setAccounts(newAccounts);
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(handleNewAccounts);
      window.ethereum.on('accountsChanged', handleNewAccounts);
      // console.log(window.ethereum);
      console.log(window.ethereum.chainId);
      switch (window.ethereum.chainId) {
        case '0x1':
          NET_NAME = 'Ethereum Mainnet';
          break;
        case '0x3':
          NET_NAME = 'Ropsten Testnet';
          break;
        case '0x4':
          NET_NAME = 'Rinkeby Testnet';
          break;
        case '0x5':
          NET_NAME = 'Goerli Testnet';
          break;
        default:
          NET_NAME = 'UNKNOWN';
      }
      return () => {
        // window.ethereum.off('accountsChanged', handleNewAccounts);
      };
    }
  }, []);

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((newAccounts) => setAccounts(newAccounts));
    } else {
      onboarding.current.startOnboarding();
    }
  };
  return (
    <Button
      variant="contained"
      sx={{ mb: 5, mx: 2.5, mt: 2 }}
      disabled={isDisabled}
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
}

export default ConnectMetaMask;