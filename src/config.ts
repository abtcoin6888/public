import {http, createConfig} from '@wagmi/vue'
import {bsc, kaia, mainnet} from '@wagmi/vue/chains'
import { injected, metaMask, safe, walletConnect } from '@wagmi/vue/connectors'

const projectId = '0c3c979e2192a3e1d8537e6f5f1c6048'

export const config = createConfig({
    chains: [ kaia],
    connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),

  ],
    transports: {

        [kaia.id]: http(),

    },
})