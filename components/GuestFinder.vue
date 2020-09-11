<template>
    <b-row class="justify-content-md-center">
        <b-col md="8">
            <label for="name">Enter your name as it appears on the invitation</label>
                <b-form-input 
                    class="mb-4"
                    type="text"
                    id="name" 
                    v-model="name" 
                    @input="getGuest($event)"
                    placeholder="Enter your name">
                    <b-spinner small variant="primary" type="grow" label="Spinning"></b-spinner>
                </b-form-input>
            <b-spinner 
                v-if="searching"
                type="grow" 
                label="Spinning"></b-spinner>
            <b-card v-if="results">
                <b-card-text
                    v-if="typeof results === 'object' && results !== null">
                    Are you {{ results.name }}?
                </b-card-text>
                <b-card-text v-else>{{ results }}</b-card-text>
                <div
                    v-if="typeof results === 'object' && results !== null">
                    <b-button 
                        @click="clearForm()"
                        variant="outline-danger">
                        No
                    </b-button>
                    <b-button 
                        @click="setGuest()"
                        variant="outline-primary">
                        Yes
                    </b-button>
                </div>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
    import debounce from 'lodash/debounce'
    export default {
        data() {
            return {
            name: '',
            results: null,
            searching: false,
            }
        },
        methods: {
            clearForm () {
                this.name=''
                this.results=null
            },
            // TODO: Bootstrap Vue inputs have a debounce param built in?
            // TODO: Subsumption problem
            getGuest: debounce(async function (val) {
                if (val.length > 2) {
                    this.searching=true
                    // TODO: There is a better way to do this with one call to the endpoint, but it will require some custom work on Strapi
                    // Also, fuzzy matching would be awesome, but I'm not quite sure how to get it.
                    const { data } = await this.$axios.get(`${process.env.baseUrl}/guests/count?name_contains=${encodeURIComponent(val)}`)
                    // TODO: Need some error handling here.
                    if (data===0) this.results = "It doesn't look like we invited anyone by that name. Are you sure you've got the right wedding?"
                    else if (data===1) {
                        const { data } = await this.$axios.get(`${process.env.baseUrl}/guests?name_contains=${encodeURIComponent(val)}`)
                        // TODO: Need some error handling here.
                        this.results = data[0]
                    } else {
                        const { data } = await this.$axios.get(`${process.env.baseUrl}/guests?name_contains=${encodeURIComponent(val)}`)
                        // TODO: Need some error handling here.
                        // TODO: We shouldn't really be getting this info on the frontend.
                        for (let i=0; i<data.length; i++) {
                           if (data[i].name.toLowerCase()===val.toLowerCase()) {
                               this.results=data[i]
                               return this.searching=false
                           }
                        }
                        this.results = "Too many results. Keep typing..."
                    }
                    this.searching=false
                }
            }, 350),
            setGuest () {
                this.$store.commit('add', {
                    entity: 'currentGuest',
                    data: this.results,
                })
            },
        },
    }
</script>
