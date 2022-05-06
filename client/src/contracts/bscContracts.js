const bnbABI = {
    name:"BNB",
}

const usdtABI = {
    decimals: 18,
    address: "0x55d398326f99059ff775485246999027b3197955",
    abi: [
        "function balanceOf(address owner) view returns (uint256)",

        "function transfer(address to, uint256 value) returns (bool)",
        "function transferFrom(address from, address to, uint value) returns (bool)"
    ],
    name:"USDT",
};
const usdcABI = {
    decimals: 18,
    address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    abi: [
        "function balanceOf(address owner) view returns (uint256)",

        "function transfer(address to, uint256 value) returns (bool)",
        "function transferFrom(address from, address to, uint value) returns (bool)"
    ],
    name:"USDC",
};
const busdABI = {
    decimals: 18,
    address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    abi: [
        "function balanceOf(address owner) view returns (uint256)",

        "function transfer(address to, uint256 value) returns (bool)",
        "function transferFrom(address from, address to, uint value) returns (bool)"
    ],
    name:"BUSD",
};



/* Defining the RPC urls for the Binance Smart Chain. */
const RPC = {
    urls: [
        "https://bsc-dataseed.binance.org/",
        "https://bsc-dataseed1.defibit.io/",
        "https://bsc-dataseed1.ninicoin.io/",
    ],
    ChainIDHex: 0x38,
    ChainIDDec: 56,
    chainName: "BSC",
    chainSymbol: "BNB",
    chainExplorer: "https://bscscan.com",
    currencys: ["BNB","USDT", "USDC", "BUSD"],
};


export const bscContract = {
    RPC,
    bnbABI,
    usdtABI,
    usdcABI,
    busdABI,
};