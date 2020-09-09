<template>
  <div>
        <b-sidebar 
          aria-label="sidebar navigation"
          id="sidebar" 
          no-header
          backdrop 
          shadow>
            <nav class="mt-5 pt-4">
              <ul>
                <b-nav-item
                  v-for="(page, slug) in pages" 
                  :key="`page_${slug}`" 
                  :to="{ path: slug==='home' ? '/' : `/${slug}` }">
                    <span :class="currentSlug===slug ? 'active' : ''" >{{ page.title }}</span>
                </b-nav-item>
              </ul>
            </nav>
        </b-sidebar>
        <div class="toggler-box">

          <b-navbar-toggle class="toggler position-fixed d-block d-sm-none" target="sidebar">
            <template v-slot:default="{ expanded }">
              <span class="hamburger hamburger--squeeze" :class="{ 'is-active': expanded }" type="button">
                <span class="hamburger-box">
                  <span class="hamburger-inner"></span>
                </span>
              </span>
            </template>
          </b-navbar-toggle>
        </div>
      <b-row class="p-0 justify-content-md-center header">
          <div class="py-3 h-100 w-100 screen">
            <b-col>
              <h1 :class="currentSlug==='home' ? 'home' : 'secondary text-center'">
                  <span
                    v-for="(name, index) in $store.state.names">
                      <b-row  class="text-center p-0 m-0">
                        <b-col class=" p-0 m-0">
                          <span class='mx-auto flourish'>{{name}}</span>
                        </b-col>
                      </b-row>
                      <b-row class="p-0 m-0">
                        <b-col  class="text-center p-0 m-0">
                          <span class='mx-auto conjunction' sm v-if="index<$store.state.names.length - 1" >
                            and
                          </span>
                        </b-col>
                      </b-row>

                  </span>
              </h1>
            </b-col>
          </div>
      </b-row>

    <Navbar 
      :pages="pages"
      :currentSlug="currentSlug" />

    <main  class="main-content columns pt-2 mt-5 mb-5">
      <div class="container column is-10">
        <nuxt />
      </div>
    </main>
  <Footer />
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import Footer from '~/components/Footer'

  export default {
    components: {
      Footer,
    },
    computed: {
      ...mapState([
        'pages',
      ]),
      currentSlug () {
        const found = false
        for (const key in this.pages) {
          if (this.pages[key].slug===this.$route.params.slug) return 'error'
        }
        return typeof this.$route.params.slug === 'undefined' ? 'home' : this.$route.params.slug
      },
    },
    data () {
        return {
            stuck: false,
        }
    },
  }
</script>