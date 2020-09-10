<template>
  <section class="section">
    <b-container>
      <b-row class="justify-content-md-center">
        <b-col lg="6" md="8">
          <h2 class="text-center mb-5">{{currentPage.title}}</h2>
          <div class="content columns is-mobile">
            <div class="text-justify"
              v-for="(text, index) of currentPage.text">
                <div v-if="text.paragraph" v-html="$md.render(text.paragraph)"></div>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <b-container v-if="currentPage.carouselPhotos">
      <b-row  class="justify-content-md-center">
        <b-col lg="6" md="8">
          <b-carousel
            id="carousel-fade"
            fade
            controls
            indicators>
            <b-carousel-slide
              v-for="(photo, index) in currentPage.carouselPhotos"
              :key="`carousel-photo-${index}`" 
              :img-src="photo.url" />
          </b-carousel>
        </b-col>
      </b-row>
    </b-container>
    <b-container
      v-if="places.length">
      <b-row>
        <b-col
          :md="hasCoords ? 6 : 12">
          <component :is="hasCoords? 'ol' : 'ul'">
            <li :class="[{'pl-4' : hasCoords}, slug, 'place', 'mb-4']"
              v-for="(place, index) of places">
              <h3>{{place.name}}</h3>
              <div v-if="place.place_name">{{place.place_name}}</div>
              <div v-if="place.date_time">
                <span v-if="place.showDate">{{$moment(place.date_time).tz("America/Los_Angeles").format("D MMMM YYYY")}},</span>
                <span>{{$moment(place.date_time).tz("America/Los_Angeles").format("h:mmA")}}</span>
              </div>
              <div v-if="place.text" v-html="$md.render(place.text)"></div>
              <a v-if="place.website" class="link" :href="place.website" target="_blank">Website</a>
              <Address
                class="address"
                v-if="place.address"
                :street-a="place.address.street1" 
                :street-b="place.address.street2" 
                :city="place.address.city"
                :state="place.address.state"
                :zip="place.address.zip_code"
                />
                <div>
                  <a v-if="place.directionLink" class="link" :href="place.directionLink" target="_blank">Get Directions</a>
                </div>

                <b-img v-if="index!==places.length-1" class="pl-4 pt-2" :src="hasCoords ? '/narrow-divider.png' : '/wide-divider.png'" />
              <!--{{place}}<br /><br />-->
            </li>
           
          </component>
        </b-col>
        <b-col
          md="6"
          v-if="hasCoords"
          class="column map">
          <b-card 
            class="w-100 h-100" 
            no-body>
            <Map :places="places"/>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <b-container
      v-if="currentPage.is_photos">
      <Photos />
    </b-container>
    <div
      v-if="currentPage.is_guest_management">
          <GuestManager v-if="$store.state.currentGuest.hasOwnProperty('name')" />
          <GuestFinder v-else />
    </div>
    <b-container
      v-if="currentPage.is_payments">
      <Payment />
    </b-container>
  </section>
</template>

<script>
import Address from '~/components/Address'
import GuestFinder from '~/components/GuestFinder'
import GuestManager from '~/components/GuestManager'
import Payment from '~/components/Payment'
import Map from '~/components/Map'
import Photos from '~/components/Photos'
import { mapState } from 'vuex'

export default {
  validate ({ params, store }) {
    if (Object.keys(store.state.pages).includes(params.slug) || typeof params.slug==='undefined') return true
    return false
  },
  head () {
    return {
      title: this.slug==='home' ? this.$store.state.names.join(' & ') : `${this.currentPage.title} | ${this.$store.state.names.join(' & ') }`,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        { hid: 'description', name: 'description', content: 'Wedding webside for Leigh Graziano and Ryan McCarthy, June 17th, 2021.' },
        { hid: 'robots', name: 'robots', content: 'noindex, nofollow' },
      ]
    }
  },
  async asyncData (ctx) {
    if (ctx.payload) {
      return {
        currentPage: ctx.payload
      }
    } 
  },
  computed: {
    slug () {
      return typeof this.$route.params.slug === 'undefined' ? 'home' : this.$route.params.slug
    },
    places () {
      const places = []
      for (let i=0; i<(this.currentPage.places || []).length; i++) {
          const query = []
          const place = { ...this.currentPage.places[i] }
          place.showDate = true
          if (this.currentPage.places[i-1] && place.date_time) {
            if (this.$moment(place.date_time).tz("America/Los_Angeles").format("DD MM YYYY") === this.$moment(this.currentPage.places[i-1].date_time).tz("America/Los_Angeles").format("DD MM YYYY")) place.showDate = false
          }
          if (place.address) {
            if (place.address.street1) query.push(encodeURIComponent(place.address.street1))
            if (place.address.street2) query.push(encodeURIComponent(place.address.street2))
            if (place.address.city) query.push(encodeURIComponent(place.address.city))
            if (place.address.state) query.push(encodeURIComponent(place.address.state))
            if (place.address.zip_code) query.push(encodeURIComponent(place.address.zip_code))
          }
          if (query.length>0) {
            place['directionLink'] = "https://www.google.com/maps/search/?api=1&query=" + query.join('+');  
          }
          places.push(place)
      }
      return places
    },
    hasCoords () {
      // If any of the places has longitude and latitude, we'll include a map.
      for (let i=0; i<this.places.length; i++) {
        if (this.places[i].latitude && this.places[i].longitude) return true
      }
      return false
    },
  },
  components: {
    Address,
    GuestFinder,
    GuestManager,
    Map,
    Payment,
    Photos,
  }
}
</script>