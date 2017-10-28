<template>
  <v-ons-page>
    <v-ons-list>
      <v-ons-list-item>
        <div class="center">
          <v-ons-input float
            v-model="tweet"
          />
        </div>
      </v-ons-list-item>
      <v-ons-list-item>
        <div class="right">
          <v-ons-button>Tweet</v-ons-button>
        </div>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
  export default {
    name: 'tweet-input',
    data () {
      return {
        tweet: ''
      }
    }
  }
</script>
