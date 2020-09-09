<template>
    <b-container>
        <b-row class="justify-content-md-center">
            <b-col md="8">
            <h2 class="text-center mb-5">Error</h2>
            <div class="content columns is-mobile">
                <div class="text-center">
                    <div class="nuxt-error">{{ errorMessage }}</div>
                </div>
            </div>
            </b-col>
        </b-row>
    </b-container>
</template>
<script>

export default {
  name: 'nuxt-error',
  layout: 'default', // optional
  async asyncData (ctx) {
    if (ctx.payload) {
      return {
        currentPage: ctx.payload
      }
    } 
  },
  head () {
    return {
      title: `Error | ${this.$store.state.names.join(' & ') }`,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        { hid: 'description', name: 'description', content: 'Wedding webside for Leigh Graziano and Ryan McCarthy, June 17th, 2021.' },
        { hid: 'robots', name: 'robots', content: 'noindex, nofollow' },
      ]
    }
  },
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    slug () {
      return typeof this.$route.params.slug === 'undefined' ? 'home' : this.$route.params.slug
    },
    errorMessage() {
      if (this.error.statusCode === 404) {
        return "Oops! 404 Error."
      }
      // catch everything else
      return 'Oh no. Something has gone wrong.'
    },
  }
}
</script>