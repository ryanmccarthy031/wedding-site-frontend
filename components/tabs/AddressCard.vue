<template>
    <div>
        <b-card-title
            class="d-flex">
            Contact Info
        </b-card-title>
        <b-card-text>Be sure to leave us an email, so we can share the pictures with you when they're available!</b-card-text>
        <b-row class="px-2">
            <b-col class="px-1" md="6">
                <b-input-group 
                    v-for="(email, index) in emails"     
                    :key="`email_${index}`"             
                    class="mb-2">
                    <b-form-input
                        placeholder="Email"
                        @input="handleEmailInput($event, index)"
                        :value="emails[index].email"
                        :state="emailState"
                        type="email">
                    </b-form-input>
                    <b-input-group-append>
                        <b-button
                            v-if="emails.length>1 || emails[index].email"
                            @click="removeEmail(index)"
                            variant="outline-danger">
                            <b-icon
                                icon="dash"></b-icon>
                        </b-button>
                        <b-button 
                            v-if="index===emails.length-1 && index < 4"
                            @click="addEmail()"
                            variant="outline-primary">
                            <b-icon
                                icon="plus"></b-icon>
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-col>
            <b-col  class="px-1" md="6">
                <b-input-group
                    v-for="(phone, index) in phones"     
                    :key="`phone_${index}`"             
                    class="mb-2">
                    <b-form-input
                        v-mask="'1 (###) ### ####'" 
                        placeholder="1 (444) 555 1234"
                        @input="handlePhoneInput($event, index)"
                        :value="phones[index].phone_number"
                        type="tel">
                    </b-form-input>
                    <b-input-group-append>
                        <b-button 
                            v-if="phones.length>1 || phones[index].phone_number"
                            @click="removePhone(index)"
                            variant="outline-danger">
                            <b-icon
                                icon="dash"></b-icon>
                        </b-button>
                        <b-button
                            @click="addPhone()"
                            v-if="index===phones.length-1 && index < 4"
                            variant="outline-primary">
                            <b-icon
                                icon="plus"></b-icon>
                        </b-button>
                    </b-input-group-append>
                </b-input-group>
            </b-col>
        </b-row>
        <b-row class="px-2">
            <b-col 
                class="px-1"
                v-for="(field, key) in computedAddress"
                :key="`address_field_${key}`"
                :sm="getWidth(key)">
                <b-form-input 
                    :id="key" 
                    class="mb-2"
                    @input="validate()"
                    :placeholder="field.placeholder" 
                    v-model="field.value"
                    :state="field.state"
                    trim>
                </b-form-input>
            </b-col>
        </b-row>
    </div>

</template>

<script>
    import { mask } from 'vue-the-mask'
    import { mapState } from 'vuex'

    export default {
        // TODO: Why is this needed? Why does the value reset itself after the first save?
        mounted () {
            this.$store.commit('add', {
                entity: 'currentGuest',
                data: this.guest,
            })
        },
        data() {
            return {
                saving: false,
                currentAddress: {
                    street1: {
                        placeholder: 'Street 1',
                        value: null,
                        state: null,
                    },
                    street2: {
                        placeholder: 'Street 2',
                        value: null,
                        state: null,
                    },
                    city: {
                        placeholder: 'City',
                        value: null,
                        state: null,
                    },
                    state: {
                        placeholder: 'State',
                        value: null,
                        state: null,
                    },
                    zip_code: {
                        placeholder: 'Zip Code',
                        value: null,
                        state: null,
                    },
                },
                currentStreet1: null,
                currentStreet2: null,
                currentCity: null,
                currentState: null,
                currentZipCode: null,
                currentEmails: [],
                currentPhones: [],
                emailState: null,
            }
        },
        directives: {mask},
        methods: {
            getWidth (key) {
                if (key==='state') return 2
                else if (key==='zip_code') return 3
                else if (key==='city') return 7
                else return 12
            },
            validate () {
                for (const key in this.currentAddress) {
                    if (key!=='street2' && 
                        (typeof this.currentAddress[key].value === "undefined" || this.currentAddress[key].value==='')) {
                        this.currentAddress[key].state = false
                    } else {
                        this.currentAddress[key].state = null
                    }
                    this.validateEmail()
                }
            },
            validateEmail () {
                this.emailState = !(this.currentEmails || []).length ? false : null
            },
            processData () {
                for (let i=this.phones.length - 1; i>=0; i--) {
                    if (this.phones[i].phone_number==='') {
                        this.removePhone(i)
                    }
                }
                const phones = this.phones.length===1 && this.phones[0].phone_number==='' ? [] : this.phones

                for (let i=this.emails.length - 1; i>=0; i--) {
                    if (this.emails[i].email==='') {
                        this.removeEmail(i)
                    }
                }
                const emails = this.emails.length===1 && this.emails[0].email==='' ? [] : this.emails

                this.validateEmail()
                console.log("EEEE", this.emailState)
                if (this.emailState===false) return false
                for (const key in this.currentAddress) {
                    if (this.currentAddress[key].state===false) return false
                }

                const guest = { ...this.guest }
                guest.phone_number = phones
                guest.email = emails
                guest.address = {
                    street1: this.currentAddress.street1.value,
                    street2: this.currentAddress.street2.value,
                    city: this.currentAddress.city.value,
                    state: this.currentAddress.state.value,
                    zip_code: this.currentAddress.zip_code.value,
                }
                if (this.guest.address && this.guest.address.id) {
                    guest.address.id = this.guest.address.id
                }

                return {...guest}
            },
            addPhone () {
                const phones = [ ...this.phones ]
                phones.push({phone_number:''})
                this.phones = phones
            },
            removePhone (index) {
                const phones = [ ...this.phones ]
                if (phones.length===1) phones[index] = {phone_number:''}
                else phones.splice(index, 1)
                this.phones = phones
                
            },
            handlePhoneInput (val, index) {
                const phones = [ ...this.phones ]
                phones[index] = {phone_number: val}
                this.phones = phones
            },
            addEmail () {
                const emails = [ ...this.emails ]
                emails.push({email:''})
                this.emails = emails
            },
            removeEmail (index) {
                const emails = [ ...this.emails ]
                if (emails.length===1) emails[index] = {email:''}
                else emails.splice(index, 1)
                this.emails = emails
            },
            handleEmailInput (val, index) {
                const emails = [ ...this.emails ]
                emails[index] = {email: val}
                this.emails = emails
                this.validateEmail()
            },
        },
        computed: {
            isValid () {
                for (const key in this.currentAddress) {
                   if (this.currentAddress[key].state===false) return false
                }
                return true
            },
            ...mapState({
                stateGuest: state=>state.currentGuest
            }),
            guest () {
                return { ...this.stateGuest }
            },
            computedAddress () {
                for (const key in this.currentAddress) {
                    this.currentAddress[key].value = this[key]
                }

                return this.currentAddress
            },
            address () {
                if (this.guest.address) {
                    return { ...this.guest.address }
                }
                return {
                    street1: '',
                    street2: '',
                    city: '',
                    state: '',
                    zip: '',
                 }
            },
            phones: {
                set (val) {
                    this.currentPhones = val
                },
                get () {
                    if (!this.currentPhones.length) {
                        if (this.guest.phone_number.length) {
                            const phones = []
                            for (let i=0; i<this.guest.phone_number.length; i++) {
                                phones.push({ ...this.guest.phone_number[i] })
                            }
                            this.currentPhones = phones
                        } else {
                            this.currentPhones = [{phone_number:''}]
                        }
                    }
                    return this.currentPhones
                },
            },
            emails: {
                set (val) {
                    this.currentEmails = val
                },
                get () {
                    if (!this.currentEmails.length) {
                        if (this.guest.email.length) {
                            const emails = []
                            for (let i=0; i<this.guest.email.length; i++) {
                                emails.push({ ...this.guest.email[i] })
                            }
                            this.currentEmails = emails
                        } else {
                            this.currentEmails = [{email:''}]
                        }
                    }   
                    return this.currentEmails
                },
            },
            street1: {
                set (val) {
                    this.currentStreet1 = val
                },
                get () {
                    if (this.currentStreet1===null) {
                        if (this.address.street1) this.currentStreet1=this.address.street1
                    }
                    return this.currentStreet1
                },
            },
            street2: {
                set (val) {
                    this.currentStreet2 = val
                },
                get () {
                    if (this.currentStreet2===null) {
                        if (this.address.street1) this.currentStreet2=this.address.street2
                    }
                    return this.currentStreet2
                },
            },
            city: {
                set (val) {
                    this.currentCity = val
                },
                get () {
                    if (this.currentCity===null) {
                        if (this.address.city) this.currentCity=this.address.city
                    }
                    return this.currentCity
                },
            },
            state: {
                set (val) {
                    this.currentState = val
                },
                get () {
                    if (this.currentState===null) {
                        if (this.address.state) this.currentState=this.address.state
                    }
                    return this.currentState
                },
            },
            zip_code: {
                set (val) {
                    this.currentZipCode = val
                },
                get () {
                    if (this.currentZipCode ===null) {
                        if (this.address.zip_code) this.currentZipCode=this.address.zip_code
                    }
                    return this.currentZipCode
                },
            },
        }
    }
</script>
