<template>
    <div>
        <div v-if="streetA">{{streetA}}</div>
        <div v-if="streetB">{{streetB}}</div>
        <div v-if="city && state && zip">{{`${city}, ${state}  ${zip}`}}</div>
    </div>
</template>
<script>
    export default {
        props: {
            streetA: String,
            streetB: String,
            city: String,
            state: String,
            zip: String,
        }
    }
</script>