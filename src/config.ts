import {http, createConfig} from '@wagmi/vue'
import {bsc, kaia, mainnet} from '@wagmi/vue/chains'
import { injected, metaMask, safe, walletConnect } from '@wagmi/vue/connectors'


export const config = createConfig({
    chains: [mainnet, kaia, bsc],
    connectors: [
    injected(),
    walletConnect({ projectId='0c3c979e2192a3e1d8537e6f5f1c6048',chainId=8217 }),
    metaMask(),
    safe(),
  ],
    transports: {
        [mainnet.id]: http(),
        [kaia.id]: http(),
        [bsc.id]: http()
    },
})