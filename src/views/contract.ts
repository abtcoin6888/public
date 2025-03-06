import { getContract } from "thirdweb";
import { defineChain } from "thirdweb";
import { sepolia, } from "thirdweb/chains";
import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
import { createThirdwebClient } from "thirdweb";
import {ref} from "vue";


const thirdweb_secret_key='C0ZGo9TbizvBacxRT3KUCQnfp4YRxgnnsV-vDUMh6HrjV4kfoHzHTpTE_p_2cWxlnIzkrRQo7XdV_yu-WPejiQ'
const kaiaChain = defineChain(8217);
export const client = createThirdwebClient({
  secretKey: thirdweb_secret_key,
});

export const usdtContract = getContract({
  client,
  address: "0x5c13e303a62fc5dedf5b52d66873f2e59fedadc2",
  chain: kaiaChain,
});

export const boraContract = getContract({
  client,
  address: "0x02cbe46fb8a1f579254a9b485788f2d86cad51aa",
  chain: kaiaChain,
});

export const grndContract = getContract({
  client,
  address: "0x84f8c3c8d6ee30a559d73ec570d574f671e82647",
  chain: kaiaChain,
});

export const nptContract = getContract({
  client,
  address: "0xe06597d02a2c3aa7a9708de2cfa587b128bd3815",
  chain: kaiaChain,
});

export default {usdtContract, client, boraContract, grndContract, nptContract};

