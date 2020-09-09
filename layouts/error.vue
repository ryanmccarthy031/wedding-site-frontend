<template>
  <div class="nuxt-error">
    {{ message }}
  </div>
</template>
<script>

export default {
  name: 'nuxt-error',
  layout: 'default', // optional
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
  data () {
      return {
          message: ''
      }
  },
  computed: {
    errorPage() {
      if (this.error.statusCode === 404) {
        return this.message="Oops! 404 Error."
      }
      // catch everything else
      return this.message='Oh no. Something has gone wrong.'
    },
  }
}
</script>