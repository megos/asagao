<template>
  <v-ons-list-item
    modifier="longdivider"
    :key="idx"
  >
    <div class="left">
      <span class="list-item__thumbnail skel"></span>
    </div>
    <div class="center">
      <v-ons-row>
        <v-ons-col width="50%">
          <div class="skel content"></div>
        </v-ons-col>
      </v-ons-row>
      <div class="skel content"></div>
      <div class="skel content"></div>
      <div class="skel content"></div>
    </div>
  </v-ons-list-item>
</template>

<script>
  export default {
    name: 'tweet-skelton',
    props: [ 'idx' ]
  }
</script>

<style scoped>
  .skel {
    background-color: #e2e2e2;
  }

  .content {
    margin: 2px;
    height: 10px;
    width: 100%;
  }
</style>
