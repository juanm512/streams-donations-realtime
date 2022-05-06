const maticABI = {
    decimals: 6,
    address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    abi: [
        "function balanceOf(address owner) view returns (uint256)",

        "function transfer(address to, uint256 value) returns (bool)",
        "function transferFrom(address from, address to, uint value) returns (bool)"
    ],
    name:"MATIC",
};
const usdtABI = {
    decimals: 6,
    address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    abi: [
        "function balanceOf(address owner) view returns (uint256)",

        "function transfer(address to, uint256 value) returns (bool)",
        "function transferFrom(address from, address to, uint value) returns (bool)"
    ],
    name:"USDT",
};
const usdcABI = {
    decimals: 6,
    address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    abi: [
        "function balanceOf(address owner) view returns (uint256)",

        "function transfer(address to, uint256 value) returns (bool)",
        "function transferFrom(address from, address to, uint value) returns (bool)"
    ],
    name:"USDC",
};
const busdABI = {
    decimals: 18,
    address: "0x9fb83c0635de2e815fd1c21b3a292277540c2e8d",
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
        "https://polygon-rpc.com",
        "https://rpc-mainnet.maticvigil.com",
        "https://rpc-mainnet.matic.network",
    ],
    ChainIDHex: 0x89,
    ChainIDDec: 137,
    chainName: "POLYGON",
    chainSymbol: "MATIC",
    chainExplorer: "https://polygonscan.com/",
    currencys: ["MATIC","USDT", "USDC", "BUSD"],
};


export const polygonContract = {
    RPC,
    maticABI,
    usdtABI,
    usdcABI,
    busdABI,
};