import AxsLogo from "../logos/axsLogo.jsx";
import BnbLogo from "../logos/bnbLogo.jsx";
import BusdLogo from "../logos/busdLogo.jsx";
import MaticLogo from "../logos/maticLogo.jsx";
import RonLogo from "../logos/ronLogo.jsx";
import SlpLogo from "../logos/slpLogo.jsx";
import UsdcLogo from "../logos/usdcLogo.jsx";
import UsdtLogo from "../logos/usdtLogo.jsx";
import WethLogo from "../logos/wethLogo.jsx";



const getLogos = (name) => {

    switch (name) {
        case 'AXS':
            return <AxsLogo width="30px" />
        case 'BNB':
            return <BnbLogo width="30px" />
        case 'BUSD':
            return <BusdLogo width="30px" />
        case 'MATIC':
            return <MaticLogo width="30px" />
        case 'RON':
            return <RonLogo width="30px" />
        case 'SLP':
            return <SlpLogo width="30px" />
        case 'USDC':
            return <UsdcLogo width="30px" />
        case 'USDT':
            return <UsdtLogo width="30px" />
        case 'WETH':
            return <WethLogo width="30px" />
        default:
            return "";
    }

}

export default getLogos;