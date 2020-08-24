<template>
    <b-card
        title="Log In">
        <b-form-group class="mb-0">
            <b-form-input 
                class="mb-3" 
                v-model="username"
                :state="isValid.username" 
                placeholder="Enter username"></b-form-input>
            <b-form-input 
                class="mb-3" 
                type="password"
                v-model="password" 
                :state="isValid.password"
                placeholder="Enter password"></b-form-input>
            <p 
                v-if="showError"
                class="text-center text-danger">
                {{ errorMessage }}
            </p>
        </b-form-group>
        <b-row class="justify-content-end text-center">
            <b-col>
                <b-button
                    v-if="!logging_in"
                    :disabled="logging_in"
                    @click.prevent="login"
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
    </b-card>
</template>

<script>
    import jsCookie from 'js-cookie'
    import get from 'lodash/get'

    export default {
        data() {
            return {
            username: '',
            password: '',
            logging_in: false,
            showError: false,
            errorMessage: '',
            isValid: {
                username: null,
                password: null,
            },
            }
        },
        computed: {
            allValid () {
                this.isValid.username = this.username==='' ? false : true
                this.isValid.password = this.password==='' ? false : true
                for (const key in this.isValid) {
                    if (!this.isValid[key]) return false
                }
                return true
            }
        },
        methods: {
            login () {
                if (this.allValid) {
                    this.logging_in = true
                    this.showError = false
                    this.$axios.post(`${process.env.localUrl}/api/auth/local`, {
                        identifier: this.username,
                        password: this.password,
                    })
                        .then(({ data })=>{
                            this.$store.commit('add', { entity: 'auth', data: data })
                            jsCookie.set('auth', data)
                            this.$emit('loggedIn')
                        }).catch(err=>{
                            const error = get(err, 'response.data.message[0].messages[0].message', null)
                            if (error==="Identifier or password invalid.") {
                                this.errorMessage = "Username or password invalid."
                            } else {
                                this.errorMessage = "An error occurred. Please refresh and try again."
                            }
                            this.showError=true
                        }).finally(()=>this.logging_in = false)
                }

            },
        },
    }
</script>
