<template>
    <div>
        <b-card-title
            class="d-flex">
            Song Requests
        </b-card-title>
        <b-form-group label="We'd like to have a little something for everyone at the reception.
            What would you like to hear?">
            <b-row 
                v-for="(song, index) of songs"
                :key="`song_${index}`">
                <b-col
                    md="5">
                    <div class="mb-4">
                        <b-form-input
                            :id="`song_title_${index}`"
                            class="mb-2"
                            placeholder="Song Title"
                            @input="handleChange($event, index, 'title')"
                            :value="song.title"
                            debounce="300"
                            type="text">
                        </b-form-input>
                        <b-form-input
                            :id="`artist_${index}`"
                            class="mb-2"
                            placeholder="Artist"
                            @input="handleChange($event, index, 'artist')"
                            :value="song.artist"
                            debounce="300"
                            type="text">
                        </b-form-input>
                        <b-button
                            v-if="songs.length>1 || song.title || song.artist"
                            class="w-100 mb-2"
                            @click="remove(index)"
                            variant="outline-danger">
                            Remove Song
                        </b-button>
                        <b-button
                            v-if="index===songs.length-1"
                            class="w-100"
                            @click="add()"
                            variant="outline-primary">
                            Add Another Song
                        </b-button>
                    </div>
                </b-col>
                <b-col
                    md="7">
                    <client-only placeholder="Loading Text Editor...">
                        <vue-editor  
                            class="mb-4" 
                            :editor-toolbar="customToolbar" 
                            @input="handleChange($event, index, 'comment')"
                            :value="song.comment"></vue-editor>
                    </client-only>
                </b-col>
            </b-row>

        </b-form-group>

    </div>
</template>

<script>
    export default {
        data: () => ({
            saving: false,
            currentSongs:[],
            customToolbar: [
                [{ header: [false, 1, 2, 3] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
            ],
        }),
        props: {
            guestId: String,
        },
        computed: {
            emptySong () {
                return {
                    artist: '',
                    title: '',
                    comment: 'What do you love about this song?',
                    guest: this.guestId,
                }
            },
            defaultComment () {
                return `What do you love about ${this.songs.length>1 ? 'these songs' : 'this song'}?`
            },
            songs: {
                set (val) {
                    this.currentSongs=val
                },
                get () {
                    if (!this.currentSongs.length) {
                        if (this.$store.state.currentGuest.songs.length) {
                            this.currentSongs= [ ...this.$store.state.currentGuest.songs ]
                        } else {
                            this.currentSongs = [{ ...this.emptySong }]
                        }
                    }
                    return this.currentSongs
                },
            },
        },
        methods: {  
            handleChange (val, index, field) {
                const songs= [ ...this.songs ]
                songs[index] = { ...songs[index] }
                songs[index][field] = val
                this.songs = songs
            },
            remove (index) {
                let songs = [ ...this.songs ]
                if (songs.length===1) {
                    songs = [{ ...this.emptySong }]
                } else {
                    songs.splice(index, 1)
                }
                this.songs = songs
            },
            add () {
                const songs = [ ...this.songs ]
                songs.push({ ...this.emptySong })
                this.songs=songs
            },
            processData () {
                const songs = [ ...this.songs ]
                for (let i=this.songs.length-1; i>=0; i--) {
                    if (this.songs[i].title==='' && this.songs[i].artist==='') {
                        songs.splice(i, 1)
                    }
                }
                this.songs = songs.length ? songs : [{ ...this.emptySong }]
                return { songs: songs }
            },
        },
    }
</script>