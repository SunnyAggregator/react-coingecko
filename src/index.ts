import { Fraction } from "@saberhq/token-utils";
import type { UseQueryResult } from "react-query";
import { useQuery } from "react-query";

import { fetchNullable } from "./fetchNullable";

/**
 * Constructs the URL to retrieve prices from CoinGecko.
 * @param tokens
 * @returns
 */
export const buildCoinGeckoPricesURL = (tokens: readonly string[]): string =>
  `https://api.coingecko.com/api/v3/simple/price?ids=${tokens.join(
    "%2C"
  )}&vs_currencies=usd`;

const createEmptyResult = <T extends string>(
  tokens: readonly T[]
): CoinGeckoPrices<T> => {
  const ret = {} as CoinGeckoPrices<T>;
  tokens.forEach((token) => {
    ret[token] = null;
  });
  return ret;
};

/**
 * Prices of each token.
 */
export type CoinGeckoPrices<T extends string> = {
  [C in T]: Fraction | null;
};

/**
 * Fetches prices of tokens from CoinGecko.
 * @returns The CoinGecko prices.
 */
export const useCoinGeckoPrices = <T extends string>(
  tokens: readonly T[]
): UseQueryResult<CoinGeckoPrices<T>> => {
  return useQuery(["coinGeckoPrices", ...tokens], async () => {
    const coingeckoPricesURL = buildCoinGeckoPricesURL(tokens);
    const rawData = await fetchNullable<{
      [C in T]?: {
        usd: number;
      };
    }>(coingeckoPricesURL);
    if (!rawData) {
      return createEmptyResult(tokens);
    }

    const ret = {} as CoinGeckoPrices<T>;
    tokens.forEach((token) => {
      const priceInfo = rawData[token];
      ret[token] = priceInfo ? Fraction.fromNumber(priceInfo.usd) : null;
    });
    return ret;
  });
};
