<template>
    <div>
        <b-card-title
            class="d-flex">
            Comments
        </b-card-title>
        <client-only placeholder="Loading Text Editor...">
            <vue-editor class="mb-4" :editor-toolbar="customToolbar" v-model="comment"></vue-editor>
        </client-only>
    </div>
    
</template>
<script>
    export default {
        data: () => ({
            saving: false,
            currentComment: null,
            customToolbar: [
                [{ header: [false, 1, 2, 3] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
            ],
        }),
        computed: {
            comment: {
                set (val) {
                    this.currentComment = val
                },
                get () {
                    if (this.currentComment===null) {
                        if (this.$store.state.currentGuest.comment) {
                            this.currentComment = this.$store.state.currentGuest.comment
                        } else {
                            this.currentComment = "Is there anything you'd like to share with us?"
                        }
                    }
                    return this.currentComment
                },
            },
        },
        methods: {
            processData () {
                return { comment: this.comment }
            },
        },
    }
</script>