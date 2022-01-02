<template>
  <v-card elevation="0">
    <v-row ref="row" align="center" justify="center" class="ma-0">
      <canvas ref="canvas" />
    </v-row>
    <v-overlay absolute :value="$fetchState.pending">
      <v-progress-circular indeterminate />
    </v-overlay>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const loadTexture = async (url: string) => {
  return await new THREE.TextureLoader().loadAsync(url)
}

const overrideMapping = {
  earth: 'earth_daymap',
  venus: 'venus_atmosphere',
} as { [key: string]: string }

export default Vue.extend({
  props: {
    tokenId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    metadata: null,
    map: null as THREE.Texture | null,
    camera: null as THREE.Camera | null,
    renderer: null as THREE.WebGLRenderer | null,
    controls: null as OrbitControls | null,
    mesh: null as THREE.Mesh | null,
    rotation: 0,
    rotationInterval: -1 as unknown as ReturnType<typeof setInterval>,
  }),
  watch: {
    metadata: {
      deep: true,
      handler(val) {
        this.$emit('metadata', val)
      },
    },
  },
  async fetch() {
    const tokenURI = await this.$ethereum.$token.tokenURI(this.tokenId)
    const metadata = JSON.parse(await this.$ipfs.read(tokenURI))

    const name = metadata.name.toLowerCase()
    const key = overrideMapping[name] || name
    this.map = await loadTexture(
      `https://solartextures.b-cdn.net/2k_${key}.jpg`
    )

    this.metadata = metadata
  },
  methods: {
    onResize() {
      const element = this.$refs.row! as HTMLElement
      const size = Math.min(element.clientWidth, element.clientHeight)

      this.renderer?.setSize(size, size)
    },
    async createViewer() {
      const renderer = new THREE.WebGLRenderer({
        canvas: this.$refs.canvas as HTMLCanvasElement,
      })

      const size = 300
      renderer.setSize(size, size)
      renderer.setPixelRatio(devicePixelRatio)

      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000)
      camera.translateZ(2.8)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.minDistance = 1.12
      controls.maxDistance = 10

      this.mesh = new THREE.Mesh(
        new THREE.SphereBufferGeometry(1, 32, 32),
        new THREE.MeshBasicMaterial({ map: this.map })
      )

      const scene = new THREE.Scene()
      scene.add(this.mesh)

      this.camera = camera
      this.renderer = renderer
      this.controls = controls

      this.onResize()

      renderer.render(scene, camera)
      controls.addEventListener('change', () => renderer.render(scene, camera))

      if (this.rotationInterval != -1 as any) {
        clearInterval(this.rotationInterval)
      }

      this.rotationInterval = setInterval(() => {
        const radian = (this.rotation += 0.2) * (Math.PI / 180)
        this.mesh!.rotation.y = radian
        renderer.render(scene, camera)
      }, 20)
    },
  },
  created() {
    window.addEventListener('resize', this.onResize)

    this.controls?.dispose()
    this.renderer?.dispose()
  },
  destroyed() {
    window.removeEventListener('resize', this.onResize)

    if (this.rotationInterval != -1 as any) {
      clearInterval(this.rotationInterval)
    }
  },
  async mounted() {
    this.$watch('metadata', () => {
      this.createViewer()
    })
  },
})
</script>