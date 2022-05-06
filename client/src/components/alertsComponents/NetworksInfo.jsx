import { bscContract } from "../../contracts/bscContracts";
import { polygonContract } from "../../contracts/polygonContracts";
import { roninContract } from "../../contracts/roninContracts";

const NetworksInfo = () => {
    return (
        <div class="flex justify-center">
                <div class="basis-full md:basis-1/3">
                    <h2 className="text-bold text-2xl">Binance Smart Chain (BSC)</h2>
                    <ul>
                        <li>
                            <b>RPC url:</b> {bscContract.RPC.urls[0]}
                        </li>
                        <li>
                            <b>Chain ID:</b> {bscContract.RPC.ChainIDDec}
                        </li>
                        <li>
                            <b>Symbol:</b> {bscContract.RPC.chainSymbol}
                        </li>
                        <li>
                            <b>Explorer:</b> {bscContract.RPC.chainExplorer}
                        </li>
                    </ul>
                </div>
                <div class="basis-full md:basis-1/3">
                    <h2 className="text-bold text-2xl">Polygon</h2>
                    <ul>
                        <li>
                            <b>RPC url:</b> {polygonContract.RPC.urls[0]}
                        </li>
                        <li>
                            <b>Chain ID:</b> {polygonContract.RPC.ChainIDDec}
                        </li>
                        <li>
                            <b>Symbol:</b> {polygonContract.RPC.chainSymbol}
                        </li>
                        <li>
                            <b>Explorer:</b> {polygonContract.RPC.chainExplorer}
                        </li>
                    </ul>
                </div>
                <div class="basis-full md:basis-1/3">
                    <h2 className="text-bold text-2xl">Ronin</h2>
                    <ul>
                        <li>
                            <b>RPC url:</b> {roninContract.RPC.urls[0]}
                        </li>
                        <li>
                            <b>Chain ID:</b> {roninContract.RPC.ChainIDDec}
                        </li>
                        <li>
                            <b>Symbol:</b> {roninContract.RPC.chainSymbol}
                        </li>
                        <li>
                            <b>Explorer:</b> {roninContract.RPC.chainExplorer}
                        </li>
                    </ul>
                </div>
            </div>
    );
};


export default NetworksInfo;