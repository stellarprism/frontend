import { Plugin } from '@nuxt/types'
import { EthereumService } from '~/services/Ethereum'

const plugin: Plugin = async ({}, inject) => {
  const service = new EthereumService()
  await service.initialize()

  inject('ethereum', service)
}

export default plugin
