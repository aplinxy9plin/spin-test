import { useContext } from "react";
import * as nearAPI from "near-api-js";
import { AppCtx } from "../context/Context";

export const useContract = () => {
  const { wallet } = useContext(AppCtx);

  const getMarkets = async () => {
    if (!wallet) return;
    try {
      // incorrect return types!
      const contract: any = new nearAPI.Contract(
        wallet.account(),
        "app_2.spin_swap.testnet",
        {
          viewMethods: ["markets"], // view methods do not change state but usually return a value
          changeMethods: [],
        }
      );
      return await contract.markets();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const viewMarket = async (market_id: number) => {
    if (!wallet) return;
    try {
      // incorrect return types!
      const contract: any = new nearAPI.Contract(
        wallet.account(),
        "app_2.spin_swap.testnet",
        {
          viewMethods: ["view_market"], // view methods do not change state but usually return a value
          changeMethods: [],
        }
      );
      return await contract.view_market({ market_id });
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return {
    getMarkets,
    viewMarket,
  };
};
