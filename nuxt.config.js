import axios from 'axios'

export default {
  vue: {
    config: {
      productionTip: true,
      devtools: true,
    }
  },
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'universal',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'static',
  /*
  ** ENV variables
  */
  env: {
    baseName: process.env.BASE_NAME || 'localhost',
    protocol: process.env.PROTOCOL || 'http://',
    baseUrl: `${process.env.PROTOCOL || 'http://'}${process.env.BASE_NAME || 'localhost'}`,
    localUrl: `${process.env.PROTOCOL || 'http://'}${process.env.LOCAL_URL || 'localhost'}`,
    stripePublicKey: `${process.env.STRIPE_PUBLIC_KEY}`,
  },
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://js.stripe.com/v3' }
    ],
  },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/scss/main.scss',
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    { src: "~/plugins/vue2-editor", ssr: false }
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
      // Doc: https://www.npmjs.com/package/@nuxtjs/moment
      '@nuxtjs/moment',
      'nuxt-webfontloader',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.org/docs#nuxt-js
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/modules/tree/master/packages/markdownit
    '@nuxtjs/markdownit',
    // Doc: https://gitlab.com/broj42/nuxt-gmaps
    ['nuxt-gmaps',{ key: process.env.GMAPS_API_KEY }],
  ],
  /*
  ** Bootstrap-Vue module configuration
  */
  bootstrapVue: {
    icons: true // Install the IconsPlugin (in addition to BootStrapVue plugin
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Markdownit module configuration
  */
  markdownit: {
    preset: 'default',
    linkify: true,
    breaks: true,
    injected: true
  },
  /*
  ** Moment module configuration
  */
  moment: {
    timezone: {
      matchZones: process.env.TIMEZONE || 'America/New_York',
      startYear: parseInt(process.env.TIMEZONE_START_YEAR, 10) || 2020,
      endYear: parseInt(process.env.TIMEZONE_END_YEAR, 10) || 2030,
    },
    defaultTimezone: 'America/Los_Angeles',
  },
  /*
  ** Web Font Loader module configuration
  */
  webfontloader: {
    custom: {
      families: [
        'IM Fell English:n4',
        'IM Fell English SC:n4',
        'Hobbiton Brushhand:n4',
      ],
      urls: [
          // for each Google Fonts add url + options you want
          // here add font-display option
          'https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&display=swap',
          'https://fonts.googleapis.com/css2?family=IM+Fell+English+SC&display=swap',
      ]
    },
    timeout: 2000,
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    babel: { compact: true },
  },
  generate: {
    fallback: true,
    async routes () {
      const framework = await axios.get(`${process.env.PROTOCOL || 'http://'}${process.env.BASE_NAME || 'localhost'}/framework`)
      const carousel = await axios.get(`${process.env.PROTOCOL || 'http://'}${process.env.BASE_NAME || 'localhost'}/carousel-photos`)
      const pages = framework.data.pages.map(page=>{
            if (page.slug==='home') {
              page.slug=''
              page.carouselPhotos=carousel.data.photos.map(photo=>{
                return {
                  alternativeText: photo.alternativeText,
                  url: photo.url,
                }
              })
              page.names=framework.data.host_names.map(name=>name.person_name)
            }
            return {
              route: `/${page.slug}`,
              payload: page,
            }
          })
      for (const key in pages) {
        if (!pages[key].payload.is_included) delete pages[key]
      }
      return pages
    },
  }
}