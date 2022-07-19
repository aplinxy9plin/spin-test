import { useState, useEffect } from "react";
import BigNumber from "bignumber.js";
import { useContract } from "../hooks/useContract";

type MarketsType = {
  id: number;
  base: {
    ticker: string;
    decimal: number;
    address: string;
  };
  quote: {
    ticker: string;
    decimal: number;
    address: string;
  };
  fee: 0;
}[];

type BidsType = {
  ask_orders: {
    price: number;
    quantity: number;
  }[];
  bid_orders: {
    price: number;
    quantity: number;
  }[];
} | null;

const Main = () => {
  const [markets, setMarkets] = useState<MarketsType>([]);
  const [bids, setBids] = useState<BidsType>(null);
  const { getMarkets, viewMarket } = useContract();

  useEffect(() => {
    getMarkets().then(async (data) => {
      setMarkets(data);
      if (data.length === 0) return;
      setBids(await viewMarket(data[0].id));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBids(await viewMarket(parseInt(e.target.value, 10)));
  };

  const formatNEAR = (amount: string | number) => {
    return new BigNumber(amount).dividedBy(10 ** 24).toFixed(3);
  };

  return (
    <div>
      <select onChange={onSelect}>
        {markets &&
          markets.map((market) => (
            <option key={market.id} value={market.id}>
              {market.base.ticker}/{market.quote.ticker}
            </option>
          ))}
      </select>
      <table>
        <thead>
          <tr>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {bids &&
            bids.ask_orders.map((order) => (
              <tr key={order.price}>
                <td>{formatNEAR(order.price)}</td>
                <td>{formatNEAR(order.quantity)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Main;
