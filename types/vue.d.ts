import Vue, { ComponentOptions } from 'vue'
import { EthereumService } from '~/services/Ethereum'
import { IPFSService } from '~/services/IPFS';

declare module 'vue/types/vue' {
  interface Vue {
    $ethereum: EthereumService
    $ipfs: IPFSService
  }
}

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}