# react-coingecko

React library for integrating with [CoinGecko](https://www.coingecko.com/) price feeds.

## Installing

```bash
yarn add @sunnyag/react-coingecko
```

## Usage

```typescript
const { prices } = useCoinGecko(["bitcoin", "ethereum", "solana"]);
console.log(prices.solana);
```
