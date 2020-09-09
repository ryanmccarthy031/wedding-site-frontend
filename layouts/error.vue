<template>
    <b-container>
        <b-row class="justify-content-md-center">
            <b-col md="8">
            <h2 class="text-center mb-5">Error</h2>
            <div class="content columns is-mobile">
                <div class="text-center">
                    <p class="nuxt-error">{{ errorMessage }}</p>
                    <p>Head back <a :href="link">home</a>.</p>
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
    async created () {
        const framework = await this.$axios.get(`${process.env.baseUrl}/framework`)
        const carousel = await this.$axios.get(`${process.env.baseUrl}/carousel-photos`)
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
                return page
            })
        const keyedPages = await this.$store.dispatch('keyObj', { array: pages.filter(page=>page.is_included), key: 'slug' })
        this.$store.commit('add', {
            entity: 'pages',
            data: keyedPages,
        })

        const names = framework.data.host_names.map(name=>name.person_name)
        this.$store.commit('add', { entity: 'names', data: names })
    },
    props: {
        error: {
            type: Object,
            default: () => {},
        },
    },
    computed: {
        link () {
            return `${process.env.localUrl}`
        },
        slug () {
            return typeof this.$route.params.slug === 'undefined' ? 'home' : this.$route.params.slug
        },
        errorMessage() {
            if (this.error.statusCode === 404) {
                return "Not all those who wander are lost. But you are."
            }
            // catch everything else
            return 'Oh no. Try refreshing your browser.'
        },
    }
}
</script>