<template>
  <div id="container">
    <div id="body" class="opening zoom-large">
      <div id="universe" class="scale-stretched">
        <div id="galaxy">
          <div id="solar-system" class="earth">
            <div
              v-for="planet in planets"
              :key="planet.id"
              :id="planet.id"
              :class="{
                orbit: !planet.isStar,
              }"
            >
              <div
                :class="{
                  pos: !planet.isStar,
                }"
              >
                <div v-if="planet.hasMoon" class="orbit">
                  <div class="pos">
                    <div class="moon"></div>
                  </div>
                </div>
                <div
                  :class="{
                    planet: !planet.isStar,
                  }"
                  @click="click(planet)"
                >
                  <div v-if="planet.hasRing" class="ring"></div>
                  <dl class="infos">
                    <dt
                      style="width: 100px"
                      :style="{
                        color: planet.state.isOwned
                          ? 'lightgreen'
                          : planet.state.isOnSale
                          ? 'yellow'
                          : undefined,
                        fontWeight: planet.state.isOwned ? 'bold' : undefined,
                      }"
                    >
                      {{ planet.name }} <br />
                      <template v-if="planet.state.isOwned"> (owned) </template>
                      <template v-if="planet.state.isOnSale">
                        (on sale)
                      </template>
                    </dt>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="stars"></div>
    <!-- <div class="twinkling"></div> -->
    <div id="planet"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface TokenState {
  tokenId: number
  isOnSale: boolean
  isOwned: boolean
}

interface Planet {
  id: string
  name: string
  hasRing: boolean
  hasMoon: boolean
  isStar: boolean
  state?: TokenState
}

export default Vue.extend({
  head() {
    return {
      title: 'Universe',
    }
  },
  data: () => ({
    container: null as HTMLElement | null,
    body: null as HTMLElement | null,
    universe: null as HTMLElement | null,
    solarsys: null as HTMLElement | null,
    tokenStates: {} as { [key: string]: TokenState },
  }),
  computed: {
    planets(): Array<Planet> {
      return [
        {
          id: 'mercury',
          name: 'Mercury',
          hasRing: false,
          hasMoon: false,
          isStar: false,
        },
        {
          id: 'venus',
          name: 'Venus',
          hasRing: false,
          hasMoon: false,
          isStar: false,
        },
        {
          id: 'earth',
          name: 'Earth',
          hasRing: false,
          hasMoon: true,
          isStar: false,
        },
        {
          id: 'mars',
          name: 'Mars',
          hasRing: false,
          hasMoon: false,
          isStar: false,
        },
        {
          id: 'jupiter',
          name: 'Jupiter',
          hasRing: false,
          hasMoon: false,
          isStar: false,
        },
        {
          id: 'saturn',
          name: 'Saturn',
          hasRing: true,
          hasMoon: false,
          isStar: false,
        },
        {
          id: 'uranus',
          name: 'Uranus',
          hasRing: false,
          hasMoon: false,
          isStar: false,
        },
        {
          id: 'neptune',
          name: 'Neptune',
          hasRing: false,
          hasMoon: false,
          isStar: false,
        },
        {
          id: 'sun',
          name: 'Sun',
          hasRing: false,
          hasMoon: false,
          isStar: true,
        },
      ].map((x: Planet) => {
        x.state = this.tokenStates[x.id] || {
          tokenId: -1,
          isOnSale: false,
          isOwned: false,
        }

        return x
      })
    },
  },
  methods: {
    click(planet: Planet) {
      const { state } = planet

      if (state?.tokenId == undefined) {
        return
      }

      this.$router.push({
        path: `/planets/${state?.tokenId}`,
      })
    },
  },
  async fetch() {
    const address = (await this.$ethereum.getAddress()).toLowerCase()

    const totalSupply = await this.$ethereum.$token.totalSupply()

    const tokenStates = {} as { [key: string]: TokenState }
    for (let id = 0; id < totalSupply; id++) {
      const tokenURI = await this.$ethereum.$token.tokenURI(id)
      const metadata = JSON.parse(await this.$ipfs.read(tokenURI))

      const owner = (await this.$ethereum.$token.ownerOf(id)).toLowerCase()

      const isOwned = address == owner
      const isOnSale =
        !isOwned && (await this.$ethereum.$marketplace.isOnSale(id))

      const name = metadata.name.toLowerCase()

      tokenStates[name] = {
        tokenId: id,
        isOnSale,
        isOwned,
      }
    }

    this.tokenStates = tokenStates
  },
  mounted() {
    this.container = document.getElementById('container')
    this.body = document.getElementById('body')
    this.universe = document.getElementById('universe')
    this.solarsys = document.getElementById('solar-system')

    setTimeout(() => {
      this.body!.classList.remove('view-2D', 'opening')
      this.body!.classList.add('view-3D')
    }, 200)
  },
})
</script>

<style lang="scss" scoped>
  /*
                                                                  Copyright (c) 2012 Julian Garnier
                                                                  Licensed under the MIT license
                                                                */
  #container {
    color: white !important;
    z-index: 5;
  }

  #universe {
    z-index: 1;
    position: absolute;
    overflow: hidden;
    width: 100%;
    height: 100%;
    left: 0;
    background-position: center 40%;
    background-repeat: no-repeat;
    background-size: cover;
  }

  #galaxy {
    position: relative;
    width: 100%;
    height: 100%;
    /*perspective: 4000;*/
  }

  #solar-system {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
  }

  .orbit {
    position: absolute;
    top: 50%;
    left: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform-style: preserve-3d;
    animation-name: orbit;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  .orbit .orbit {
    animation-name: suborbit;
  }

  .pos {
    position: absolute;
    top: 50%;
    width: 2em;
    height: 2em;
    margin-top: -1em;
    margin-left: -1em;
    transform-style: preserve-3d;
    animation-name: invert;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  #sun,
  .planet,
  #earth .moon {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1em;
    height: 1em;
    margin-top: -0.5em;
    margin-left: -0.5em;
    border-radius: 50%;
    transform-style: preserve-3d;
  }

  #sun {
    z-index: 5;
    background-color: #fb7209;
    background-repeat: no-repeat;
    background-size: cover;
    box-shadow: 0 0 60px rgba(255, 160, 60, 0.4);
  }

  .planet {
    background-color: #202020;
    background-repeat: no-repeat;
    background-size: cover;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  .ring {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
  }

  #saturn .ring {
    width: 2em;
    height: 2em;
    margin-top: -1em;
    margin-left: -1em;
    border: 0.3em solid rgba(160, 147, 130, 0.7);
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  #saturn .ring:after {
    border-radius: 50%;
    position: absolute;
    content: '';
    top: 50%;
    left: 50%;
    width: 2.2em;
    height: 2.2em;
    margin-top: -1.1em;
    margin-left: -1.1em;
    border: 0.07em solid rgba(160, 147, 130, 0.5);
    box-sizing: border-box;
    box-sizing: border-box;
  }

  /* --------------------------------------------------------------------------- planets index */
  #mercury {
    z-index: 1;
  }

  #venus {
    z-index: 1;
  }

  #earth {
    z-index: 1;
  }

  #moon {
    z-index: 1;
  }

  #mars {
    z-index: 1;
  }

  #jupiter {
    z-index: 1;
  }

  #saturn {
    z-index: 1;
  }

  #uranus {
    z-index: 1;
  }

  #neptune {
    z-index: 1;
  }

  #sun {
    z-index: 1;
  }

  /* --------------------------------------------------------------------------- animations */
  @keyframes orbit {
    0% {
      transform: rotateZ(0deg);
    }

    100% {
      transform: rotateZ(-360deg);
    }
  }

  @keyframes suborbit {
    0% {
      transform: rotateX(90deg) rotateZ(0deg);
    }

    100% {
      transform: rotateX(90deg) rotateZ(-360deg);
    }
  }

  @keyframes invert {
    0% {
      transform: rotateX(-90deg) rotateY(360deg) rotateZ(0deg);
    }

    100% {
      transform: rotateX(-90deg) rotateY(0deg) rotateZ(0deg);
    }
  }

  /* --------------------------------------------------------------------------- opening */
  .view-3D .opening #sun,
  .view-3D .opening .orbit,
  .view-3D .opening .pos,
  .view-3D .opening .planet,
  .view-3D .opening .satelite,
  .view-3D .opening .ring {
    transition-duration: 4s;
  }

  #universe.opening #sun {
    box-shadow: 0 0 0 rgba(255, 160, 60, 0);
  }

  /* --------------------------------------------------------------------------- 2D view */
  .view-2D.zoom-large #sun {
    transform-style: flat;
  }

  .view-2D.zoom-large .orbit {
    transform-style: flat;
  }

  .view-2D #sun,
  .view-2D .ring {
    transform: rotateX(0deg);
  }

  .view-2D .planet,
  .view-2D .moon {
    transform: rotateX(90deg);
  }

  /* --------------------------------------------------------------------------- 3D view */
  .view-3D.zoom-large #sun {
    transform-style: preserve-3d;
  }

  .view-3D.zoom-large .orbit {
    transform-style: preserve-3d;
  }

  .view-3D #solar-system {
    transform: rotateX(75deg);
  }

  .view-3D #sun {
    transform: rotateX(-90deg);
  }

  .view-3D .ring {
    transform: rotateX(90deg);
  }

  .view-3D .planet,
  .view-3D .moon {
    transform: rotateX(0deg);
  }

  /* --------------------------------------------------------------------------- large zoom */
  .zoom-large #solar-system {
    width: 100%;
  }

  .zoom-large.view-2D .scale-stretched #solar-system {
    font-size: 26%;
  }

  .zoom-large.view-3D .scale-stretched #solar-system {
    font-size: 62%;
  }

  .zoom-large.view-2D .scale-d #solar-system {
    font-size: 22%;
  }

  .zoom-large.view-3D .scale-d #solar-system {
    font-size: 48%;
  }

  .zoom-large.view-2D .scale-s #solar-system {
    font-size: 7%;
  }

  .zoom-large.view-3D .scale-s #solar-system {
    font-size: 14%;
  }

  /* --------------------------------------------------------------------------- close zoom */
  .zoom-close #solar-system {
    width: 200%;
    font-size: 100%;
  }

  .zoom-close .scale-stretched #solar-system {
    margin-left: -100%;
  }

  .zoom-close .scale-d #solar-system {
    margin-left: -106%;
  }

  .zoom-close.view-2D .scale-d #solar-system {
    font-size: 84%;
  }

  .zoom-close.view-3D .scale-d #solar-system {
    font-size: 84%;
  }

  .zoom-close .scale-s #solar-system {
    margin-left: -145%;
  }

  .zoom-close.view-2D .scale-s #solar-system {
    font-size: 40%;
  }

  .zoom-close.view-3D .scale-s #solar-system {
    font-size: 40%;
  }

  .zoom-close.view-2D .planet,
  .zoom-close.view-2D .moon {
    transform: rotateX(0deg);
  }

  .zoom-close.view-3D .planet {
    transform: rotateX(-90deg);
  }

  .zoom-close.view-3D .moon {
    transform: rotateX(90deg);
  }

  .zoom-close .pos {
    left: 100% !important;
    top: 50% !important;
  }

  /* --------------------------------------------------------------------------- data */
  /* --------------------------------------------------------------------------- speed */
  /* sideral years */
  #mercury .pos,
  #mercury .planet,
  #mercury.orbit {
    animation-duration: 2.89016s;
  }

  #venus .pos,
  #venus .planet,
  #venus.orbit {
    animation-duration: 7.38237s;
  }

  #earth .pos,
  #earth .planet,
  #earth.orbit {
    animation-duration: 12.00021s;
  }

  #earth .orbit .pos,
  #earth .orbit {
    animation-duration: 0.89764s;
  }

  #mars .pos,
  #mars .planet,
  #mars.orbit {
    animation-duration: 22.57017s;
  }

  #jupiter .pos,
  #jupiter .planet,
  #jupiter.orbit {
    animation-duration: 142.35138s;
  }

  #saturn .pos,
  #saturn .planet,
  #saturn.orbit,
  #saturn .ring {
    animation-duration: 353.36998s;
  }

  #uranus .pos,
  #uranus .planet,
  #uranus.orbit {
    animation-duration: 1008.20215s;
  }

  #neptune .pos,
  #neptune .planet,
  #neptune.orbit {
    animation-duration: 1977.49584s;
  }

  /* --------------------------------------------------------------------------- planets sizes */
  /* --------------------------------------------------------------------------- stretched sizes */
  .scale-stretched #sun {
    font-size: 24em;
  }

  .scale-stretched #mercury .planet {
    font-size: 1.5em;
  }

  .scale-stretched #venus .planet {
    font-size: 3.72em;
  }

  .scale-stretched #earth .planet {
    font-size: 3.92em;
  }

  .scale-stretched #earth .moon {
    font-size: 1.2em;
  }

  .scale-stretched #mars .planet {
    font-size: 2.9em;
  }

  .scale-stretched #jupiter .planet {
    font-size: 12em;
  }

  .scale-stretched #saturn .planet {
    font-size: 10.8em;
  }

  .scale-stretched #uranus .planet {
    font-size: 4.68em;
  }

  .scale-stretched #neptune .planet {
    font-size: 4.9em;
  }

  /* --------------------------------------------------------------------------- scaled sizes */
  /*
                                                                                                  (planets radius * 2) * ratio
                                                                                                  */
  /*$distanceScaleRatio:   0.000075em;*/
  /* --------------------------------------------------------------------------- planets distance scale sizes */
  .scale-d #sun {
    font-size: 41.73048em;
  }

  .scale-d #mercury .planet {
    font-size: 0.14634em;
  }

  .scale-d #venus .planet {
    font-size: 0.36306em;
  }

  .scale-d #earth .planet {
    font-size: 0.38226em;
  }

  .scale-d #earth .moon {
    font-size: 0.08226em;
  }

  .scale-d #mars .planet {
    font-size: 0.20334em;
  }

  .scale-d #jupiter .planet {
    font-size: 4.19466em;
  }

  .scale-d #saturn .planet {
    font-size: 3.49392em;
  }

  .scale-d #uranus .planet {
    font-size: 1.52172em;
  }

  .scale-d #neptune .planet {
    font-size: 1.47732em;
  }

  /* --------------------------------------------------------------------------- planet size scale sizes */
  .scale-s #sun {
    font-size: 417.3048em;
  }

  .scale-s #mercury .planet {
    font-size: 1.4634em;
  }

  .scale-s #venus .planet {
    font-size: 3.6306em;
  }

  .scale-s #earth .planet {
    font-size: 3.8226em;
  }

  .scale-s #earth .moon {
    font-size: 0.8226em;
  }

  .scale-s #mars .planet {
    font-size: 2.0334em;
  }

  .scale-s #jupiter .planet {
    font-size: 41.9466em;
  }

  .scale-s #saturn .planet {
    font-size: 34.9392em;
  }

  .scale-s #uranus .planet {
    font-size: 15.2172em;
  }

  .scale-s #neptune .planet {
    font-size: 14.7732em;
  }

  /* --------------------------------------------------------------------------- stretched orbits */
  .scale-stretched #mercury.orbit {
    width: 32em;
    height: 32em;
    margin-top: -16em;
    margin-left: -16em;
  }

  .scale-stretched #venus.orbit {
    width: 40em;
    height: 40em;
    margin-top: -20em;
    margin-left: -20em;
  }

  .scale-stretched #earth.orbit {
    width: 56em;
    height: 56em;
    margin-top: -28em;
    margin-left: -28em;
  }

  .scale-stretched #earth .orbit {
    width: 6em;
    height: 6em;
    margin-top: -3em;
    margin-left: -3em;
  }

  .scale-stretched #mars.orbit {
    width: 72em;
    height: 72em;
    margin-top: -36em;
    margin-left: -36em;
  }

  .scale-stretched #jupiter.orbit {
    width: 100em;
    height: 100em;
    margin-top: -50em;
    margin-left: -50em;
  }

  .scale-stretched #saturn.orbit {
    width: 150em;
    height: 150em;
    margin-top: -75em;
    margin-left: -75em;
  }

  .scale-stretched #uranus.orbit {
    width: 186em;
    height: 186em;
    margin-top: -93em;
    margin-left: -93em;
  }

  .scale-stretched #neptune.orbit {
    width: 210em;
    height: 210em;
    margin-top: -105em;
    margin-left: -105em;
  }

  /* --------------------------------------------------------------------------- scaled orbits */
  /* --------------------------------------------------------------------------- distance scale orbits */
  .scale-d #mercury.orbit {
    width: 44.74176em;
    height: 44.74176em;
    margin-top: -22.37088em;
    margin-left: -22.37088em;
  }

  .scale-d #venus.orbit {
    width: 47.35737em;
    height: 47.35737em;
    margin-top: -23.67869em;
    margin-left: -23.67869em;
  }

  .scale-d #earth.orbit {
    width: 49.50959em;
    height: 49.50959em;
    margin-top: -24.75479em;
    margin-left: -24.75479em;
  }

  .scale-d #mars.orbit {
    width: 53.58356em;
    height: 53.58356em;
    margin-top: -26.79178em;
    margin-left: -26.79178em;
  }

  .scale-d #jupiter.orbit {
    width: 82.2042em;
    height: 82.2042em;
    margin-top: -41.1021em;
    margin-left: -41.1021em;
  }

  .scale-d #saturn.orbit {
    width: 115.91713em;
    height: 115.91713em;
    margin-top: -57.95857em;
    margin-left: -57.95857em;
  }

  .scale-d #uranus.orbit {
    width: 191.00471em;
    height: 191.00471em;
    margin-top: -95.50235em;
    margin-left: -95.50235em;
  }

  .scale-d #neptune.orbit {
    width: 275.64709em;
    height: 275.64709em;
    margin-top: -137.82355em;
    margin-left: -137.82355em;
  }

  /* Moon */
  .scale-d #earth .orbit {
    width: 1em;
    height: 1em;
    margin-top: -0.5em;
    margin-left: -0.5em;
  }

  /* --------------------------------------------------------------------------- size scale orbits */
  .scale-s #mercury.orbit {
    width: 441.3048em;
    height: 441.3048em;
    margin-top: -220.6524em;
    margin-left: -220.6524em;
  }

  .scale-s #venus.orbit {
    width: 457.3048em;
    height: 457.3048em;
    margin-top: -228.6524em;
    margin-left: -228.6524em;
  }

  .scale-s #earth.orbit {
    width: 473.3048em;
    height: 473.3048em;
    margin-top: -236.6524em;
    margin-left: -236.6524em;
  }

  .scale-s #mars.orbit {
    width: 489.3048em;
    height: 489.3048em;
    margin-top: -244.6524em;
    margin-left: -244.6524em;
  }

  .scale-s #jupiter.orbit {
    width: 561.3048em;
    height: 561.3048em;
    margin-top: -280.6524em;
    margin-left: -280.6524em;
  }

  .scale-s #saturn.orbit {
    width: 705.3048em;
    height: 705.3048em;
    margin-top: -352.6524em;
    margin-left: -352.6524em;
  }

  .scale-s #uranus.orbit {
    width: 817.3048em;
    height: 817.3048em;
    margin-top: -408.6524em;
    margin-left: -408.6524em;
  }

  .scale-s #neptune.orbit {
    width: 881.3048em;
    height: 881.3048em;
    margin-top: -440.6524em;
    margin-left: -440.6524em;
  }

  /* Moon */
  .scale-s #earth .orbit {
    width: 1em;
    height: 1em;
    margin-top: -0.5em;
    margin-left: -0.5em;
  }

  /* --------------------------------------------------------------------------- planets starting position and lighting effect */
  /* --------------------------------------------------------------------------- mercury ; pos: Top */
  #mercury .pos {
    left: 50%;
    top: -1%;
  }

  #mercury .planet {
    animation-name: shadow-mercury;
  }

  @keyframes shadow-mercury {
    0% {
      box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.5);
      /* TOP */
    }

    25% {
      box-shadow: inset 4px 0 2px rgba(0, 0, 0, 0.5);
      /* LEFT */
    }

    50% {
      box-shadow: inset 13px -5px 4px rgba(0, 0, 0, 0.5);
      /* BOTTOM */
    }

    50.01% {
      box-shadow: inset -13px -5px 4px rgba(0, 0, 0, 0.5);
      /* BOTTOM */
    }

    75% {
      box-shadow: inset -4px 0 2px rgba(0, 0, 0, 0.5);
      /* RIGHT */
    }

    100% {
      box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.5);
      /* TOP */
    }
  }

  .scaled.view-2D #mercury .planet,
  .scaled.view-3D #mercury .planet {
    box-shadow: inset -4px 0 2px rgba(0, 0, 0, 0.5);
    /* RIGHT */
  }

  /* --------------------------------------------------------------------------- venus ; pos: Left */
  #venus .pos {
    left: 0;
    top: 50%;
  }

  #venus .planet {
    animation-name: shadow-venus;
  }

  @keyframes shadow-venus {
    0% {
      box-shadow: inset 4px 0 2px rgba(0, 0, 0, 0.5);
      /* LEFT */
    }

    25% {
      box-shadow: inset 22px -20px 10px rgba(0, 0, 0, 0.5);
      /* BOTTOM */
    }

    25.5% {
      box-shadow: inset -22px -20px 10px rgba(0, 0, 0, 0.5);
      /* BOTTOM */
    }

    50% {
      box-shadow: inset -4px 0 2px rgba(0, 0, 0, 0.5);
      /* RIGHT */
    }

    75% {
      box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.5);
      /* TOP */
    }

    100% {
      box-shadow: inset 4px 0 2px rgba(0, 0, 0, 0.5);
      /* LEFT */
    }
  }

  .scaled.view-2D #venus .planet,
  .scaled.view-3D #venus .planet {
    box-shadow: inset -4px 0 2px rgba(0, 0, 0, 0.5);
    /* RIGHT */
  }

  /* --------------------------------------------------------------------------- earth ; pos: Right */
  #earth .pos {
    left: 100%;
    top: 50%;
  }

  #earth .planet {
    animation-name: shadow-earth;
  }

  @keyframes shadow-earth {
    0% {
      box-shadow: inset -4px 0 2px rgba(0, 0, 0, 0.5);
      /* RIGHT */
    }

    25% {
      box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.5);
      /* TOP */
    }

    50% {
      box-shadow: inset 4px 0 2px rgba(0, 0, 0, 0.5);
      /* LEFT */
    }

    75% {
      box-shadow: inset 24px -20px 15px rgba(0, 0, 0, 0.5);
      /* BOTTOM */
    }

    75.01% {
      box-shadow: inset -24px -20px 15px rgba(0, 0, 0, 0.5);
      /* BOTTOM */
    }

    100% {
      box-shadow: inset -4px 0 2px rgba(0, 0, 0, 0.5);
      /* RIGHT */
    }
  }

  .scaled.view-2D #earth .planet,
  .scaled.view-3D #earth .planet {
    box-shadow: inset -4px 0 2px rgba(0, 0, 0, 0.5);
    /* RIGHT */
  }

  /* --------------------------------------------------------------------------- moon */
  #earth .orbit .pos {
    left: 100%;
    top: 50%;
  }

  /* --------------------------------------------------------------------------- mars ; pos: Bottom */
  #mars .pos {
    left: 50%;
    top: 100%;
  }

  #mars .planet {
    animation-name: shadow-mars;
  }

  @keyframes shadow-mars {
    0% {
      box-shadow: inset -18px -10px 10px rgba(0, 0, 0, 0.5);
      /* BOTTOM */
    }

    25% {
      box-shadow: inset -4px 0 2px rgba(0, 0, 0, 0.5);
      /* RIGHT */
    }

    50% {
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.5);
      /* TOP */
    }

    75% {
      box-shadow: inset 4px 0 2px rgba(0, 0, 0, 0.5);
      /* LEFT */
    }

    99.99% {
      box-shadow: inset 18px -10px 10px rgba(0, 0, 0, 0.5);
      /* BOTTOM */
    }

    100% {
      box-shadow: inset -18px -10px 10px rgba(0, 0, 0, 0.5);
      /* BOTTOM */
    }
  }

  .scaled.view-2D #mars .planet,
  .scaled.view-3D #mars .planet {
    box-shadow: inset -4px 0 2px rgba(0, 0, 0, 0.5);
    /* RIGHT */
  }

  /* --------------------------------------------------------------------------- jupiter ; pos: Right */
  #jupiter .pos {
    left: 100%;
    top: 50%;
  }

  #jupiter .planet {
    animation-name: shadow-jupiter;
  }

  @keyframes shadow-jupiter {
    0% {
      box-shadow: inset -16px 0 5px rgba(0, 0, 0, 0.5);
      /* RIGHT */
    }

    25% {
      box-shadow: inset 0 3px 2px rgba(0, 0, 0, 0.5);
      /* TOP */
    }

    50% {
      box-shadow: inset 16px 0 5px rgba(0, 0, 0, 0.5);
      /* LEFT */
    }

    75% {
      box-shadow: inset 94px -30px 40px rgba(0, 0, 0, 0.5);
      /* BOTTOM */
    }

    75.01% {
      box-shadow: inset -94px -30px 40px rgba(0, 0, 0, 0.5);
      /* BOTTOM */
    }

    100% {
      box-shadow: inset -16px 0 5px rgba(0, 0, 0, 0.5);
      /* RIGHT */
    }
  }

  .scaled.view-2D #jupiter .planet,
  .scaled.view-3D #jupiter .planet {
    box-shadow: inset -16px 0 5px rgba(0, 0, 0, 0.5);
    /* RIGHT */
  }

  /* --------------------------------------------------------------------------- saturn ; pos: Left */
  #saturn .pos {
    left: 0%;
    top: 50%;
  }

  #saturn .planet {
    animation-name: shadow-saturn;
  }

  @keyframes shadow-saturn {
    0% {
      box-shadow: inset 16px 0 5px rgba(0, 0, 0, 0.5);
      /* LEFT */
    }

    25% {
      box-shadow: inset 80px -30px 50px rgba(0, 0, 0, 0.5);
      /* BOTTOM */
    }

    25.01% {
      box-shadow: inset -94px -30px 40px rgba(0, 0, 0, 0.5);
      /* BOTTOM */
    }

    50% {
      box-shadow: inset -16px 0 5px rgba(0, 0, 0, 0.5);
      /* RIGHT */
    }

    75% {
      box-shadow: inset -2px 3px 2px rgba(0, 0, 0, 0.5);
      /* TOP */
    }

    100% {
      box-shadow: inset 16px 0 5px rgba(0, 0, 0, 0.5);
      /* LEFT */
    }
  }

  .scaled.view-2D #saturn .planet,
  .scaled.view-3D #saturn .planet {
    box-shadow: inset -16px 0 5px rgba(0, 0, 0, 0.5);
    /* RIGHT */
  }

  /* --------------------------------------------------------------------------- saturn ring */
  /*

                                                                                                  #saturn .ring           { animation-name:     shadow-saturn-ring; }

                                                                                                  @keyframes 
                                                                                                  shadow-saturn-ring{ 0%   { box-shadow: inset -16px  0      4px   rgba(20, 40, 50, 0.45); opacity: .4; }
                                                                                                                    25%    { box-shadow: inset -5px   -30px   12px  rgba(20, 40, 50, 0.3);  opacity: 1; }
                                                                                                                    25.01% { box-shadow: inset 5px    -30px   12px  rgba(20, 40, 50, 0.3);  opacity: 1; }
                                                                                                                    50%    { box-shadow: inset 16px   0      4px   rgba(20, 40, 50, 0.45);  opacity: .4; }
                                                                                                                    75%    { box-shadow: inset 0      30px  50px  rgba(20, 40, 50, 0);  opacity: .3; }
                                                                                                                    100%   { box-shadow: inset -16px  0      4px   rgba(20, 40, 50, 0.45);  opacity: .4; }
                                                                                                                  }

                                                                                                  .scaled.view-2D #saturn .ring,
                                                                                                  .scaled.view-3D #saturn .ring { box-shadow: inset 16px   0      4px   rgba(20, 40, 50, 0.6); }

                                                                                                  */
  /* --------------------------------------------------------------------------- uranus ; pos: Left */
  #uranus .pos {
    left: 0;
    top: 50%;
  }

  #uranus .planet {
    animation-name: shadow-uranus;
  }

  @keyframes shadow-uranus {
    0% {
      box-shadow: inset 8px 0 5px rgba(0, 0, 0, 0.5);
      /* LEFT */
    }

    25% {
      box-shadow: inset 40px -15px 40px rgba(0, 0, 0, 0.5);
      /* BOTTOM */
    }

    25.01% {
      box-shadow: inset -40px -15px 40px rgba(0, 0, 0, 0.5);
      /* BOTTOM */
    }

    50% {
      box-shadow: inset -8px 0 5px rgba(0, 0, 0, 0.5);
      /* RIGHT */
    }

    75% {
      box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.5);
      /* TOP */
    }

    100% {
      box-shadow: inset 8px 0 5px rgba(0, 0, 0, 0.5);
      /* LEFT */
    }
  }

  .scaled.view-2D #uranus .planet,
  .scaled.view-3D #uranus .planet {
    box-shadow: inset -8px 0 5px rgba(0, 0, 0, 0.5);
    /* RIGHT */
  }

  /* --------------------------------------------------------------------------- neptune ; pos: Top */
  #neptune .pos {
    left: 50%;
    top: 0;
  }

  #neptune .planet {
    animation-name: shadow-neptune;
  }

  @keyframes shadow-neptune {
    0% {
      box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.5);
      /* TOP */
    }

    25% {
      box-shadow: inset 12px 0 5px rgba(0, 0, 0, 0.5);
      /* LEFT */
    }

    50% {
      box-shadow: inset 50px -15px 40px rgba(0, 0, 0, 0.5);
      /* BOTTOM */
    }

    50.01% {
      box-shadow: inset -50px -15px 40px rgba(0, 0, 0, 0.5);
      /* BOTTOM */
    }

    75% {
      box-shadow: inset -12px 0 5px rgba(0, 0, 0, 0.5);
      /* RIGHT */
    }

    100% {
      box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.5);
      /* TOP */
    }
  }

  .scaled.view-2D #neptune .planet,
  .scaled.view-3D #neptune .planet {
    box-shadow: inset -12px 0 5px rgba(0, 0, 0, 0.5);
    /* RIGHT */
  }

  /* --------------------------------------------------------------------------- DEBUG 
                                                                                                  .pos, 
                                                                                                  .planet, 
                                                                                                  .orbit,
                                                                                                  .ring { animation-duration: 20s!important; }

                                                                                                  /* */
  /* --------------------------------------------------------------------------- navigation styles */
  dl.infos {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    margin-top: -90%;
    margin-left: 90%;
    padding-left: 100%;
    transform-origin: 100% 100%;
    transform-style: preserve-3d;
  }

  dl.infos:before {
    position: absolute;
    content: '';
    width: 15px;
    height: 30px;
    left: 15px;
    bottom: 0;
    border-top: 1px solid white;
    border-left: 1px solid white;
    transform-style: preserve-3d;
    transform: skew(-45deg, 0deg);
    box-shadow: inset 1px 1px black;
  }

  dl.infos dt {
    position: absolute;
    left: 50px;
    bottom: 30px;
    color: #fff;
    font-size: 18px;
    text-shadow: 1px 1px 2px black;
  }

  dl.infos dd:after {
    position: absolute;
    left: 50px;
    bottom: 30px;
    width: 300px;
    color: #fff;
    font-size: 22px;
    text-shadow: 1px 1px 2px black;
  }

  dl.infos dd span:after {
    position: absolute;
    left: 50px;
    bottom: 14px;
    width: 300px;
    color: #fff;
    font-size: 11px;
    text-shadow: 1px 1px 2px black;
  }

  /* --------------------------------------------------------------------------- transitions */
  .pos {
    transition-property: top, left;
  }

  #solar-system,
  .orbit,
  .planet,
  .satelite,
  .ring {
    transition-property: width, height, top, left, margin-left, margin-top,
      webkit-transform;
  }

  #sun,
  .icon {
    transition-property: width, height, webkit-transform;
  }

  #solar-system,
  #sun,
  .orbit,
  .pos,
  .planet,
  .satelite,
  .ring,
  .infos,
  .icon {
    transition-duration: 0.8s;
    transition-timing-function: ease-in-out;
  }

  #solar-system,
  #sun,
  .planet,
  .satelite,
  .ring {
    transition-delay: 0s;
  }

  .pos {
    transition-delay: 1s;
  }

  .opening #solar-system,
  .opening #sun,
  .opening .orbit,
  .opening .pos,
  .opening .planet,
  .opening .satelite,
  .opening .ring,
  .opening .infos,
  .opening h1,
  .opening #data,
  .opening dl.infos {
    transition-duration: 0s;
    transition-delay: 0s;
  }

  .opening .pos {
    transition-delay: 0s;
  }

  /* --------------------------------------------------------------------------- images */
  #body {
    background-image: url(~/assets/galaxy/body.png);
  }

  #universe {
    background-image: url(~/assets/galaxy/universe.png);
  }

  #sun {
    background-image: url(~/assets/galaxy/sun.png);
  }

  #mercury .planet {
    background-image: url(~/assets/galaxy/mercury.png);
  }

  #venus .planet {
    background-image: url(~/assets/galaxy/venus.png);
  }

  #earth .planet {
    background-image: url(~/assets/galaxy/earth.png);
  }

  #earth .moon {
    background-color: white;
  }

  #mars .planet {
    background-image: url(~/assets/galaxy/mars.png);
  }

  #jupiter .planet {
    background-image: url(~/assets/galaxy/jupiter.png);
  }

  #saturn .planet {
    background-image: url(~/assets/galaxy/saturn.png);
  }

  #uranus .planet {
    background-image: url(~/assets/galaxy/uranus.png);
  }

  #neptune .planet {
    background-image: url(~/assets/galaxy/neptune.png);
  }

  /* --------------------------------------------------------------------------- responsive styles */
  @media screen and (max-width: 299px) {
    #universe {
      font-size: 20%;
    }
  }
  @media screen and (min-width: 300px) {
    #universe {
      font-size: 24%;
    }
  }
  @media screen and (min-width: 500px) {
    #universe {
      font-size: 36%;
    }
  }
  @media screen and (min-width: 600px) {
    #universe {
      font-size: 44%;
    }
  }
  @media screen and (min-width: 760px) {
    #universe {
      font-size: 58%;
    }
  }
  @media screen and (min-width: 1000px) {
    #universe {
      font-size: 73%;
    }
  }
  @media screen and (min-width: 1300px) {
    #universe {
      font-size: 100%;
    }
  }
  @media screen and (min-width: 1600px) {
    .zoom-close .scale-d #solar-system {
      margin-left: -120%;
    }
  }

  .stars,
  .twinkling,
  .clouds {
    position: absolute;
    display: block;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }

  .stars {
    z-index: 0;
    background: #000 url('~/assets/galaxy/stars.png') repeat top center;
  }

  .twinkling {
    z-index: 1;
    background: transparent url('~/assets/galaxy/twinkling.png') repeat top center;
    animation: move-twink-back 400s linear infinite;
  }

  .clouds {
    z-index: 2;
    background: transparent url('~/assets/galaxy/clouds.png') repeat top center;
    animation: move-clouds-back 400s linear infinite;
  }

  @keyframes move-twink-back {
    from {
      background-position: 0 0;
    }
    to {
      background-position: -10000px 5000px;
    }
  }

  @keyframes move-clouds-back {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 10000px 0;
    }
  }
</style>
