<template>
    <div>
        <b-card-title
            class="d-flex">
            Guests
        </b-card-title>
        <b-form-group label="Who will be attending?">

            <b-row
                v-for="(person, index) of allGuests"
                :key="`attendant_input_${index}`">
                <b-col>
                    <b-input-group class="mb-2">
                        <b-form-input
                            :value="allGuests[index].name"
                            :state="allGuests[index].on_invitation && !isValid ? false : null"
                            @input="handleNameChange(person.id, $event, index)"
                            type="text">
                        </b-form-input>
                        <b-input-group-append>
                            <b-button 
                                v-if="!allGuests[index].on_invitation"
                                @click="removeAttending(person.id,index)"
                                variant="outline-danger">
                                <b-icon
                                    icon="dash"></b-icon>
                            </b-button>
                            <b-button 
                                v-if="allGuests.length-1===index && index < 4"
                                @click="addAttending()"
                                variant="outline-primary">
                                <b-icon
                                    icon="plus"></b-icon>
                            </b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-col>
            </b-row>
        </b-form-group>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                currentGuest: null,
                saving: false,
                guestState: null,
            }
        },
        computed: {
            isValid () {
                for (let i=0; i<this.allGuests.length; i++) {
                    if (this.allGuests[i].on_invitation && this.allGuests[i].name === '') return false
                }
                return true
            },
            guest: {
                async set (val) {
                    this.currentGuest=val
                },
                get () {
                    if (this.currentGuest===null) this.currentGuest = this.$store.state.currentGuest
                    return this.currentGuest
                },
            },
            attending: {
                async set (val) {
                    const guest = { ...this.guest }
                    guest.guests_attending = val
                    this.guest=guest
                },
                get () {
                    return [ ...this.guest.guests_attending ]
                },
            },
            invited: {
                set (val) {
                    const guest = { ...this.guest }
                    guest.name = val
                    this.guest = guest
                },
                get () {
                    return { name: this.guest.name, on_invitation: true }
                },
            },
            allGuests () {
                return [ this.invited, ...this.attending ]
            },
        },
        methods: {
            getId () {
                // A quick unique id generator so that we can manage new guests as though
                // they have mongodb ids
                return (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
                    s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))
            },
            processData () {
                return {
                    name: this.invited.name,
                    guests_attending: this.attending,
                }
            },
            addAttending() {
                const attending = Object.values(this.attending)
                attending.push({
                    name: 'Mystery Guest',
                    id: this.getId(),
                    is_new: true,
                })
                this.attending = attending
            },
            removeAttending(id, index) {
                if (this.allGuests[index].hasOwnProperty('on_invitation')) return
                const attending = [ ...this.attending ]
                for (let i=0; i<attending.length; i++) {
                    if (attending[i].id===id) attending.splice(i, 1)
                }
                this.attending = attending
            },
            handleNameChange (id, newName, index) {
                if (this.allGuests[index].hasOwnProperty('on_invitation')) {
                    return this.invited = newName                
                } else {
                    if (newName==='') this.removeAttending(id, index)
                    const attending = [ ...this.attending ]
                    for (let i=0; i<attending.length; i++) {
                        if (attending[i].id===id) {
                            attending[i] = { ...attending[i] }
                            attending[i].name = newName
                        }
                    }
                    return this.attending = attending           
                }
            }
        },
    }
</script>