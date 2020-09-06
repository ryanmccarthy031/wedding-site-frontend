<template>
    <div role="navigation" :class="stuck ? 'stuck' : ''" class="d-none d-sm-block sticky-top" aria-label="main navigation">
      <b-navbar sticky>
        <b-navbar-nav class="w-100" justified>
          <b-nav-item 
            v-for="(page, slug) in pages" 
            :key="`page_${slug}`" 
            :active="slug===currentSlug"
            :to="{ path: slug==='home' ? '/' : `/${slug}` }">
            <span class="link">{{ page.title }}</span>
          </b-nav-item>
        </b-navbar-nav>
      </b-navbar>
    </div>
</template>
<script>

  export default {
    mounted () {
        let scrolled = false

        /* Bind the scroll Event */
        window.addEventListener('scroll', function(e) {
            scrolled = true
        });
        const that = this
        let timeout = setInterval(function() {
            /* If the page was scrolled, handle the scroll */
            if (scrolled) {
                scrolled = false

                if (that.$el.getBoundingClientRect().y<5) {
                    that.stuck=true
                } else {
                    that.stuck=false
                }
            }
        }, 200);
    },
    props: {
        pages: {
            type: Object,
            default: () => {},
        },
        currentSlug: String,
    },

    data () {
        return {
            stuck: false,
        }
    },
  }
</script>