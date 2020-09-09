<template>
  <div class="nuxt-error">
    {{ errorMessage }}
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
  computed: {
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