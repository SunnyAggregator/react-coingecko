import { Fraction } from "@saberhq/token-utils";
import { useMemo } from "react";
import useSWR from "swr";

const buildCoingeckoPricesURL = (tokens: readonly string[]): string =>
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
export type CoingeckoPrices<T extends string> = {
  [C in T]: PriceInfo;
};

/**
 * Hook context.
 */
export interface UseCoingeckoPrices<T extends string> {
  /**
   * Prices of each token.
   */
  prices: CoingeckoPrices<T>;
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
 * @returns The Coingecko prices.
 */
export const useCoingeckoPrices = <T extends string>(
  tokens: readonly T[]
): UseCoingeckoPrices<T> => {
  const coingeckoPricesURL = useMemo(
    () => buildCoingeckoPricesURL(tokens),
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

  const prices: CoingeckoPrices<T> = useMemo(() => {
    if (!coingeckoPriceDataRaw) {
      if (!error) {
        const loading = {
          price: null,
          loading: true,
        };
        return tokens.reduce(
          (acc, t) => ({ ...acc, [t]: loading }),
          {}
        ) as CoingeckoPrices<T>;
      } else {
        const error = {
          price: null,
          loading: false,
        };
        return tokens.reduce(
          (acc, t) => ({ ...acc, [t]: error }),
          {}
        ) as CoingeckoPrices<T>;
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
    ) as CoingeckoPrices<T>;
  }, [coingeckoPriceDataRaw]);

  return { prices, error, isValidating };
};
