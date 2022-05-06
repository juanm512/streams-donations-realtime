const ronABI = {
    name: "RON",
}
const wethABI = {
    decimals: 18,
    address: "0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5",
    abi: [
        "function balanceOf(address owner) view returns (uint256)",

        "function transfer(address to, uint256 value) returns (bool)",
        "function transferFrom(address from, address to, uint value) returns (bool)"
    ],
    name:"WETH",
};
const slpABI = {
    decimals: 0,
    address: "0xa8754b9fa15fc18bb59458815510e40a12cd2014",
    abi: [
        "function balanceOf(address owner) view returns (uint256)",

        "function transfer(address to, uint256 value) returns (bool)",
        "function transferFrom(address from, address to, uint value) returns (bool)"
    ],
    name:"SLP",
};
const usdcABI = {
    decimals: 6,
    address: "0x0b7007c13325c48911f73a2dad5fa5dcbf808adc",
    abi: [
        "function balanceOf(address owner) view returns (uint256)",

        "function transfer(address to, uint256 value) returns (bool)",
        "function transferFrom(address from, address to, uint value) returns (bool)"
    ],
    name:"USDC",
};
const axsABI = {
    decimals: 18,
    address: "0x97a9107c1793bc407d6f527b77e7fff4d812bece",
    abi: [
        "function balanceOf(address owner) view returns (uint256)",

        "function transfer(address to, uint256 value) returns (bool)",
        "function transferFrom(address from, address to, uint value) returns (bool)"
    ],
    name:"AXS",
};
/* Defining the RPC urls for the Binance Smart Chain. */
const RPC = {
    urls: [
        "https://api.roninchain.com/rpc"
    ],
    ChainIDHex: 0x7e4,
    ChainIDDec: 2020,
    chainName: "RONIN",
    chainSymbol: "RON",
    chainExplorer: "https://explorer.roninchain.com/",
    currencys: ["RON","USDC", "AXS", "WETH", "SLP"],
};

export const roninContract = {
    RPC,
    ronABI,
    wethABI,
    slpABI,
    usdcABI,
    axsABI
}