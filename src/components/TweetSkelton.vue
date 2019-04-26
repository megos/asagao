<template>
  <v-ons-list-item
    modifier="longdivider"
  >
    <div class="left">
      <span class="list-item__thumbnail skel" />
    </div>
    <div class="center">
      <v-ons-row>
        <v-ons-col width="50%">
          <div class="skel content" />
        </v-ons-col>
      </v-ons-row>
      <div class="skel content" />
      <div class="skel content" />
      <div class="skel content" />
    </div>
  </v-ons-list-item>
</template>

<script>
export default {
  name: 'TweetSkelton',
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
