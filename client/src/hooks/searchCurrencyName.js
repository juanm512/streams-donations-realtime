const searchCurrencyName = (currency) => {
    const curren = currency.toLowerCase();
    switch (curren) {
        case 'busd':
            return "binance-usd";
        case 'usdt':
            return "tether";
        case 'usdc':
            return "usd-coin";
        case 'bnb':
            return "binancecoin";
        case 'weth':
            return "weth";
        case 'ron':
            return "ronin";
        case 'matic':
            return "matic-network";
        case 'axs':
            return "axie-infinity";
        case 'slp':
            return "smooth-love-potion";
        default:
            return curren;
    }
}
export default searchCurrencyName;