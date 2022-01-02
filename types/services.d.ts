import { EthereumService } from '~/services/Ethereum'
import { IPFSService } from '~/services/IPFS';

declare module '@nuxt/types/app' {
  interface Context {
    $ethereum: EthereumService
    $ipfs: IPFSService
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $ethereum: EthereumService
    $ipfs: IPFSService
  }
}