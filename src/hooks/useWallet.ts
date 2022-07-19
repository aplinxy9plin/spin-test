import { useEffect, useContext, useState } from "react";
import * as nearAPI from "near-api-js";
import { AppCtx } from "../context/Context";

// creates keyStore using private key in local storage
// *** REQUIRES SignIn using walletConnection.requestSignIn() ***

type UseWalletType = {
  connectWallet: () => void;
  disconnectWallet: () => void;
  isConnected: boolean;
  account: string;
  balance: string;
};

const { connect, keyStores, WalletConnection } = nearAPI;

const config = {
  networkId: "testnet",
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
  headers: {},
};

export const useWallet = (): UseWalletType => {
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState("0");
  const { setWallet, wallet } = useContext(AppCtx);

  const connectWallet = async () => {
    // connect to NEAR
    const near = await connect(config);

    // create wallet connection
    const wallet = new WalletConnection(near, "my-app");
    wallet.requestSignIn({
      contractId: "example-contract.testnet", // optional, contract requesting access
      methodNames: ["hello", "goodbye"], // optional
      // successUrl: window.location.origin + "/", // optional
      // failureUrl: window.location.origin + "/" // optional
    });
    setWallet(wallet);
  };

  const checkOnConnectedWallet = async () => {
    // connect to NEAR
    const near = await connect(config);

    // create wallet connection
    const wallet = new WalletConnection(near, "my-app");
    if (!wallet.isSignedIn()) return;
    await getBalance(wallet, wallet.getAccountId());
    setAccount(wallet.getAccountId());
    setIsConnected(true);
    setWallet(wallet);
  };

  const disconnectWallet = () => {
    if (wallet) {
      wallet.signOut();
      setWallet(null);
      setIsConnected(false);
    }
  };

  const getBalance = async (
    wallet: nearAPI.WalletConnection,
    accountId: string
  ) => {
    if (wallet) {
      const near = await connect(config);
      const account = await near.account(accountId);
      setBalance((await account.getAccountBalance()).available);
    }
  };

  useEffect(() => {
    checkOnConnectedWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    connectWallet,
    disconnectWallet,
    isConnected,
    account,
    balance,
  };
};
