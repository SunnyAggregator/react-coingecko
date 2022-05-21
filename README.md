# react-coingecko

[![npm](https://img.shields.io/npm/v/@sunnyag/react-coingecko.svg)](https://www.npmjs.com/package/@sunnyag/react-coingecko)
[![License](https://img.shields.io/npm/l/@sunnyag/react-coingecko)](https://github.com/SunnyAggregator/react-coingecko/blob/master/LICENSE)
[![Build Status](https://img.shields.io/github/workflow/status/SunnyAggregator/react-coingecko/main/master)](https://github.com/SunnyAggregator/react-coingecko/actions/workflows/main.yml?query=branch%3Amaster)
[![Contributors](https://img.shields.io/github/contributors/SunnyAggregator/react-coingecko)](https://github.com/SunnyAggregator/react-coingecko/graphs/contributors)

<p align="center">
    <img src="/img/react-coingecko.png" />
</p>

<p align="center">
    React library for <a href="https://www.coingecko.com">CoinGecko</a> price data.
</p>

## Installing

First, install and set up [React Query](https://react-query.tanstack.com/). Then run:

```bash
yarn add @sunnyag/react-coingecko
```

## Usage

Within a React Query context, run:

```typescript
const { prices } = useCoinGecko(["bitcoin", "ethereum", "solana"]);
console.log(prices.solana);
```
