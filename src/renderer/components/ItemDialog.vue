<template>
  <v-ons-dialog cancelable
    :visible="dialogVisible"
    @prehide="closeTweetItemDialog"
  >
    <v-ons-list>
      <v-ons-list-item
        tappable
      >
        <v-ons-icon icon="ion-reply" class="icon"></v-ons-icon>
        Reply
      </v-ons-list-item>
      <v-ons-list-item
        tappable
      >
        <v-ons-icon icon="ion-heart" class="icon"></v-ons-icon>
        {{ favotitePrefix }} favorite
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-dialog>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'item-dialog',
    computed: {
      favotitePrefix: function () {
        return this.favotited ? 'Add' : 'Remove'
      },
      ...mapState({
        dialogVisible: state => state.app.tweetItemDialogVisible,
        favotited: state => state.app.favotited
      })
    },
    methods: mapActions([
      'closeTweetItemDialog'
    ])
  }
</script>

<style scoped>
  .icon {
    margin-right: 5px;
  }
</style>