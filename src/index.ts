import type { UseQueryOptions, UseQueryResult } from "react-query";
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
  [C in T]: number | null;
};

export const makeCoinGeckoPricesQuery = <T extends string>(
  tokens: readonly T[]
): UseQueryOptions<
  CoinGeckoPrices<T>,
  unknown,
  CoinGeckoPrices<T>,
  string[]
> => {
  return {
    queryKey: ["coinGeckoPrices", ...tokens],
    queryFn: async ({ signal }) => {
      const coingeckoPricesURL = buildCoinGeckoPricesURL(tokens);
      const rawData = await fetchNullable<{
        [C in T]?: {
          usd: number;
        };
      }>(coingeckoPricesURL, signal);
      if (!rawData) {
        return createEmptyResult(tokens);
      }

      const ret = {} as CoinGeckoPrices<T>;
      tokens.forEach((token) => {
        const priceInfo = rawData[token];
        ret[token] = priceInfo ? priceInfo.usd : null;
      });
      return ret;
    },
  };
};

/**
 * Fetches prices of tokens from CoinGecko.
 * @returns The CoinGecko prices.
 */
export const useCoinGeckoPrices = <T extends string>(
  tokens: readonly T[],
  options: Omit<
    UseQueryOptions<CoinGeckoPrices<T>, unknown, CoinGeckoPrices<T>, string[]>,
    "queryKey" | "queryFn"
  > = {}
): UseQueryResult<CoinGeckoPrices<T>, unknown> => {
  return useQuery({ ...options, ...makeCoinGeckoPricesQuery(tokens) });
};
