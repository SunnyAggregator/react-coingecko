import { Fraction } from "@saberhq/token-utils";
import { useMemo } from "react";
import useSWR from "swr";

const buildCoinGeckoPricesURL = (tokens: readonly string[]): string =>
  `https://api.coingecko.com/api/v3/simple/price?ids=${tokens.join(
    "%2C"
  )}&vs_currencies=usd`;

/**
 * Information about a specific token's price.
 */
export interface PriceInfo {
  /**
   * Price of the token, in USD.
   */
  price: Fraction | null;
  /**
   * If true, the price is still loading.
   */
  loading: boolean;
}

/**
 * Prices of each token.
 */
export type CoinGeckoPrices<T extends string> = {
  [C in T]: PriceInfo;
};

/**
 * Hook context.
 */
export interface UseCoinGeckoPrices<T extends string> {
  /**
   * Prices of each token.
   */
  prices: CoinGeckoPrices<T>;
  /**
   * Error loading.
   */
  error?: Error;
  /**
   * Whether or not the price is being updated.
   */
  isValidating: boolean;
}

/**
 * Fetches prices of tokens from CoinGecko.
 * @returns The CoinGecko prices.
 */
export const useCoinGeckoPrices = <T extends string>(
  tokens: readonly T[]
): UseCoinGeckoPrices<T> => {
  const coingeckoPricesURL = useMemo(
    () => buildCoinGeckoPricesURL(tokens),
    [tokens]
  );

  const {
    data: coingeckoPriceDataRaw,
    error,
    isValidating,
  } = useSWR<
    {
      [C in T]: {
        usd: number;
      };
    },
    Error
  >(coingeckoPricesURL);

  const prices: CoinGeckoPrices<T> = useMemo(() => {
    if (!coingeckoPriceDataRaw) {
      if (!error) {
        const loading = {
          price: null,
          loading: true,
        };
        return tokens.reduce(
          (acc, t) => ({ ...acc, [t]: loading }),
          {}
        ) as CoinGeckoPrices<T>;
      } else {
        const error = {
          price: null,
          loading: false,
        };
        return tokens.reduce(
          (acc, t) => ({ ...acc, [t]: error }),
          {}
        ) as CoinGeckoPrices<T>;
      }
    }

    return tokens.reduce(
      (acc, t) => ({
        ...acc,
        [t]: {
          price: Fraction.fromNumber(coingeckoPriceDataRaw[t].usd),
          loading: false,
        },
      }),
      {}
    ) as CoinGeckoPrices<T>;
  }, [coingeckoPriceDataRaw]);

  return { prices, error, isValidating };
};
