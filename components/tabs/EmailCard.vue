<template>
    <div>
        <b-card-title
            class="d-flex">
            Email
        </b-card-title>
        <div>
            <b-card-text>
                Would you like to see the pictures from the wedding? Share your email with us, and we'll send you a link as soon as we have them!
            </b-card-text>    
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
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                saving: false,
                currentEmails: [],
                emailState: null,
            }
        },
        computed: {
            guestEmails () {
                return [...this.$store.state.currentGuest.email]
            },
            emails: {
                set (val) {
                    this.currentEmails = val
                },
                get () {
                    if (!this.currentEmails.length) {
                        if (this.guestEmails.length) {
                            const emails = []
                            for (let i=0; i<this.guestEmails.length; i++) {
                                emails.push({ ...this.guestEmails[i] })
                            }
                            this.currentEmails = emails
                        } else {
                            this.currentEmails = [{email:''}]
                        }
                    }
                    return this.currentEmails
                },
            },
        },
        methods: {
            validateEmail () {
                console.log("$$$$$$$$$")
                console.log((this.currentEmails || []).length)
                console.log(this.currentEmails)
                this.emailState = !(this.currentEmails || []).length ? false : null
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
            processData () {
                for (let i=this.emails.length - 1; i>=0; i--) {
                    if (this.emails[i].email==='') {
                        this.removeEmail(i)
                    }
                }
                this.validateEmail()
                console.log("DDDDDD", this.emailState)
                if (this.emailState===false) return false
                return { email: this.emails}
            },
        }
    }
</script>
