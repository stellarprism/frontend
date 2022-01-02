import { Middleware } from '@nuxt/types'

export default (async ({ $ethereum, redirect }) => {
  if (!$ethereum.connected) {
    redirect('/errors/ethereum')
  }
}) as Middleware
