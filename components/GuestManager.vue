<template>
    <b-container>
        <b-row class="justify-content-md-center mb-4">
            <b-col  lg="6" md="8">
            <div class="content columns is-mobile">
                <div class="text-justify">
                    <div>Be sure to fill out everything before you hit save! And remember, you can come back any time and change your answers!</div>
                </div>
            </div>
            </b-col>
        </b-row>
        <b-row>
            <b-col
                lg="3">
                <b-card
                    class="mb-4"
                    title="RSVP">
                    <b-form-group>
                        <b-form-radio-group
                            id="attendance"
                            v-model="guestIsComing"
                            :options="options"
                            name="attendance">
                        </b-form-radio-group>
                    </b-form-group>
                </b-card>
            </b-col>
            <b-col lg="9" class="mb-4">
                <b-card no-body>
                    <b-tabs v-model="tabIndex" justified pills card>
                        <b-tab v-if="!guestIsComing" key="1" active>
                            <template v-slot:title>
                                <span>Email</span>
                            </template>
                            <EmailCard ref="email" />
                        </b-tab>
                        <b-tab v-if="guestIsComing" key="2" active>
                            <template v-slot:title>
                                <span>Guests</span>
                            </template>
                            <AttendanceCard 
                                ref="attendance"
                                v-if="guestIsComing" />
                        </b-tab>
                        <b-tab v-if="guestIsComing" key="3">
                            <template v-slot:title>
                                <span>Contact Info</span>
                            </template>
                            <AddressCard ref="address" />
                        </b-tab>
                        <b-tab v-if="guestIsComing" key="4">
                            <template v-slot:title>
                                <span>Song Requests</span>
                            </template>
                            <SongRequestCard ref="song" :guestId="this.guest.id" />
                        </b-tab>           
                        <b-tab key="5">
                            <template v-slot:title>
                                <span>Comments</span>
                            </template>
                            <CommentCard ref="comment" />
                        </b-tab>
                    </b-tabs>
                </b-card>
            </b-col>
        </b-row>
        <b-row class="justify-content-end text-center">
            <b-col lg="9">
                <b-button
                    v-if="!saving"
                    :disabled="saving"
                    @click.prevent="save"
                    size="lg"
                    variant="outline-success">
                    Save
                </b-button>
                <b-spinner 
                    v-else 
                    class="mt-2" 
                    variant="success" 
                    label="Spinning">
                </b-spinner>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import AttendanceCard from '~/components/tabs/AttendanceCard'
    import SongRequestCard from '~/components/tabs/SongRequestCard'
    import CommentCard from '~/components/tabs/CommentCard'
    import AddressCard from '~/components/tabs/AddressCard'
    import EmailCard from '~/components/tabs/EmailCard'

    export default {
                data() {
            return {
                saving: false,
                isComing: null,
                tabIndex: 0,
            }
        },
        methods: {
            async save () {
                this.saving=true
                let guest = {}
                if (this.guestIsComing) {
                    this.$refs.address.validate()
                    const guestAddress = this.$refs.address.processData()
                    if (guestAddress===false) {
                        this.saving=false
                        return this.$bvToast.toast('It looks like some of your contact info might be missing. Are you sure everything is filled out?', {
                            title: `Something is missing`,
                            variant: 'danger',
                            solid: true
                        })
                    } 
                    const { phone_number, email, address } = guestAddress

                    const attendanceInfo = this.$refs.attendance.processData()
                    if (!attendanceInfo.name) {
                        this.saving=false
                        return this.$bvToast.toast('Did you delete your name? We definitely want to know who\'s coming.', {
                            title: `Something is missing`,
                            variant: 'danger',
                            solid: true
                        })
                    }
                    const { name, guests_attending } = attendanceInfo

                    const { songs } = this.$refs.song.processData()
                    guest = {
                        phone_number,
                        email,
                        address,
                        name,
                        guests_attending,
                        songs,
                    }
                } else {
                    const data = this.$refs.email.processData()
                    if (data===false) {
                        this.saving=false
                        return this.$bvToast.toast('It looks like you didn\'t leave us an email address.', {
                            title: `Something is missing`,
                            variant: 'danger',
                            solid: true
                        })
                    }
                    guest = { email: data.email }
                }
                const { comment } = this.$refs.comment.processData()
                guest.comment = comment
                guest.is_coming = this.guestIsComing
                const guestData = { ...this.$store.state.currentGuest, ...guest }
                this.$store.commit('add', {
                    entity: 'currentGuest',
                    data: guestData,
                })

                const { data } = await this.$axios.put(`${process.env.baseUrl}/guests/${guestData._id}`, guestData)
                    .catch(()=>{
                        return this.$bvToast.toast('It looks like there was a problem saving your information. Please refresh your browser and try again.', {
                            title: `Oh no! Something went wrong.`,
                            variant: 'danger',
                            solid: true
                        })
                        this.saving=false
                    })
                this.saving=false
            },
        },
        computed: {
            options () {
                return [
                    { text: `${this.pronouns.pronoun} can't make it.`, value: false },
                    { text: `${this.pronouns.contraction} coming!`, value: true },

                ]
            },
            guest () {
                return { ...this.$store.state.currentGuest }
            },
            guestIsComing: {
                set (val) {
                    this.isComing = val
                    this.tabIndex=0
                },
                get () {
                    if (this.isComing===null) return this.guest.is_coming
                    else return this.isComing
                },
            },
            pronouns () {
                const we = {
                    pronoun: "We",
                    contraction: "We're",
                    withVerb: "We are",
                }
                const i = {
                    pronoun: "I",
                    contraction: "I'm",
                    withVerb: "I am",
                }
                return (this.guest.name.includes('&') || this.guest.name.includes(' and ')) ||
                    (this.guest.hasOwnProperty('guests_attending') && 
                    this.guest.guests_attending.length) ? we : i
            },
        },

        components: {
            AttendanceCard,
            SongRequestCard,
            CommentCard,
            AddressCard,
            EmailCard,
        }
    }
</script>
