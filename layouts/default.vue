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
                  :to="slug==='home'? '/' : `${slug}`">
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
      <b-row class="py-3 justify-content-md-center header">
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
    // mounted () {
    //     let scrolled = false

    //     /* Bind the scroll Event */
    //     window.addEventListener('scroll', function(e) {
    //         scrolled = true
    //     });
    //     const that = this
    //     let timeout = setInterval(function() {
    //         /* If the page was scrolled, handle the scroll */
    //         if (scrolled) {
    //             scrolled = false

    //             if (that.$children[2].$el.getBoundingClientRect().y<5) {
    //                 that.stuck=true
    //             } else {
    //                 that.stuck=false
    //             }
    //         }
    //     }, 200);
    // },
    components: {
      Footer,
    },
    computed: {
      ...mapState([
        'pages',
      ]),
      currentSlug () {
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