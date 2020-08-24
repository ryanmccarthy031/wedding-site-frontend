<template>
    <div>
        <client-only>
            <b-row
                class="justify-content-center">
                <b-col md="8">
                    <Login 
                        v-if="!isAuthenticated" />
                    <div v-else>
                        <b-container fluid class="p-4 gallery">
                            <b-row
                                v-for="(row, i) in list"
                                :key="`photo_row_${i}`">
                                <b-col
                                    lg="3"
                                    sm="6"
                                    class="pb-4"
                                    v-for="(photo, j) in row"
                                    :key="`photo_${j}_row_${i}`">
                                    <b-card no-body>
                                        <b-img
                                            @click="openSlideshow({
                                                row: i,
                                                photo: j,
                                            })"
                                            :alt="photo.alt"
                                            :src="photo.thumbnail"></b-img>
                                    </b-card>

                                </b-col>
                            </b-row>
                        </b-container>
                        <infinite-loading 
                            ref="infiniteLoading"
                            @infinite="infiniteHandler">
                            <div slot="spinner"><b-spinner label="Spinning"></b-spinner></div>
                            <div slot="no-more"></div>
                            <div slot="no-results">Sorry, there are no photos available yet!</div>
                        </infinite-loading>
                    </div>
                </b-col>
            </b-row>
            <b-modal 
                id="slideshow" 
                size="lg"
                centered 
                body-class="p-0">
                <div slot="modal-header" />
                <div slot="modal-footer" />
                <b-carousel
                    id="carousel"
                    ref="carousel"
                    class="h-100 w-100"
                    :interval="0"
                    @sliding-start="handleSlide($event)"
                    controls>
                    <b-carousel-slide
                        ref="slide"
                        v-for="(image, index) in unchunkedList"
                        :key="`carousel_image_${index}`"
                        :img-alt="image.alt"
                        :img-src="image.src"></b-carousel-slide>
                </b-carousel>
            </b-modal>
            <div
                slot="placeholder"
                class="d-flex justify-content-center mb-3">
                <b-spinner label="Loading..."></b-spinner>
            </div>
        </client-only>
    </div>
</template>

<script>
    import jsCookie from 'js-cookie'
    import InfiniteLoading from 'vue-infinite-loading'

    import Login from '~/components/Login'
    import { mapState } from 'vuex'

    export default {
        data() {
            return {
            username: 'Wedding Photos',
            password: 'Let\'s see those pictures!',
            logging_in: false,
            list: [],
            page: 0,
            }
        },
        computed: {
            ...mapState({
                auth: 'auth',
            }),
            isAuthenticated () {
                if (this.auth || jsCookie.get('auth')) {
                    return true
                    
                }
                return false
            },
            imgSrcRoot () {
            return `${process.env.localUrl}/api`
            },
            unchunkedList () {
                const unchunked = []
                for (let i=0; i<this.list.length; i++) {
                    for (let j=0;j<this.list[i].length;j++) {
                        unchunked.push({
                            ...this.list[i][j],
                            row: i,
                            index: j,
                        })
                    }
                }
                return unchunked
            }
        },
        methods: {
            openSlideshow ({ row, photo }) {
                const index = this.unchunkedList.findIndex(image=>image.row===row && image.index===photo)
                this.$bvModal.show('slideshow')     
                this.$nextTick(()=>{
                    this.$refs.carousel.setSlide(this.unchunkedList.findIndex(image=>image.row===row && image.index===photo))
                    this.$refs.carousel.next()
                    this.$refs.carousel.prev()
                })
            },
            handleSlide (index) {
                if (index===this.unchunkedList.length-1) {
                    this.infiniteHandler()
                }
            },
            chunk (array, size) {
                const chunked_arr = []
                let copied = [...array]
                const numOfChild = Math.ceil(copied.length / size)
                for (let i = 0; i < numOfChild; i++) {
                    chunked_arr.push(copied.splice(0, size))
                }
                return chunked_arr
            },
            infiniteHandler ($state) {
                let auth = this.auth ? this.auth : jsCookie.get('auth')
                if (auth === undefined) return
                if (typeof auth==='string' && auth!=='undefined') auth=JSON.parse(auth)
                const result = this.$axios.get(`${process.env.localUrl}/api/photos?_start=${this.page}&_limit=1`, {
                    headers: {
                        authorization: `Bearer ${auth.jwt}`
                    }
                })
                    .then(result=>{
                        if (result.data.length) {
                            this.page++
                            const photoArray = result.data[0].Photos.map(photo=>{
                                return {
                                    alt: photo.alternativeText,
                                    src: `${this.imgSrcRoot}${photo.formats.large.url}`,
                                    thumbnail: `${this.imgSrcRoot}${photo.formats.thumbnail.url}`,
                                }
                            })
                            const chunkedArray = this.chunk(photoArray, 4)
                            this.list.push(...chunkedArray)
                            if ($state) $state.loaded();
                        } else {
                            if ($state) $state.complete();
                        }
                    })
            },
        },
        components: { 
            Login,
            InfiniteLoading,
        },
    }
</script>
