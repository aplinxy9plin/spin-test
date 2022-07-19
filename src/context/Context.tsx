import { createContext, useState } from "react";
import * as nearAPI from "near-api-js";

type AppContextType = {
  isConnected: boolean;
  wallet: nearAPI.WalletConnection | null;
  setIsConnected: (isConnected: boolean) => void;
  setWallet: (wallet: nearAPI.WalletConnection | null) => void;
};

export const AppCtx = createContext<AppContextType>({
  isConnected: false,
  wallet: null,
  setIsConnected: () => {},
  setWallet: () => {},
});

type ProviderPropsType = {
  children: React.ReactNode;
};

const AppProvider: React.FC<ProviderPropsType> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [wallet, setWallet] = useState<nearAPI.WalletConnection | null>(null);

  return (
    <AppCtx.Provider
      value={{
        isConnected,
        wallet,
        setIsConnected,
        setWallet,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
};

export default AppProvider;
