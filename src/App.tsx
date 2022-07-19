import * as nearAPI from "near-api-js";
import { useWallet } from "./hooks/useWallet";
import Main from "./components/Main";

const { utils } = nearAPI;

function App() {
  const { connectWallet, isConnected, account, disconnectWallet, balance } =
    useWallet();

  const formatedBalance = utils.format.formatNearAmount(balance);
  const explorerAddress = `https://explorer.testnet.near.org/accounts/${account}`;

  return (
    <div className="App">
      <nav style={{ width: 300 }}>
        {isConnected ? (
          <div>
            <div style={{ display: "flex" }}>
              <a target="_blank" href={explorerAddress} rel="noreferrer">
                {account}
              </a>
              <button style={{ marginLeft: 6 }} onClick={disconnectWallet}>
                Disconnect
              </button>
            </div>
            <p>Balance: {formatedBalance} NEAR</p>
          </div>
        ) : (
          <button onClick={connectWallet}>Connect</button>
        )}
      </nav>
      {isConnected && <Main />}
    </div>
  );
}

export default App;
