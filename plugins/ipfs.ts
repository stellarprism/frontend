import { Plugin } from '@nuxt/types'
import { IPFSService } from '~/services/IPFS'

const plugin: Plugin = async ({}, inject) => {
  const service = new IPFSService()
  await service.initialize()

  inject('ipfs', service)
}

export default plugin
