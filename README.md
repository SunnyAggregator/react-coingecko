# react-coingecko

[![License](https://img.shields.io/badge/license-LGPL-3.0)](https://github.com/SunnyAggregator/react-coingecko/blob/master/LICENSE)
[![Build Status](https://img.shields.io/github/workflow/status/SunnyAggregator/react-coingecko/main/master)](https://github.com/SunnyAggregator/react-coingecko/actions/workflows/main.yml?query=branch%3Amaster)
[![Contributors](https://img.shields.io/github/contributors/SunnyAggregator/react-coingecko)](https://github.com/SunnyAggregator/react-coingecko/graphs/contributors)

<p align="center">
    <img src="/img/react-coingecko.png" />
</p>

<p align="center">
    React library for <a href="https://www.coingecko.com">CoinGecko</a> price data.
</p>

## Installing

```bash
yarn add @sunnyag/react-coingecko
```

## Usage

```typescript
const { prices } = useCoinGecko(["bitcoin", "ethereum", "solana"]);
console.log(prices.solana);
```
