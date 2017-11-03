<template>
  <v-ons-dialog cancelable
    :visible="dialogVisible"
    @prehide="closeDialog"
  >
    <v-ons-list>
      <v-ons-list-item
        tappable
        @click="moveTweetInput"
      >
        <v-ons-icon icon="ion-reply" class="icon"></v-ons-icon>
        Reply
      </v-ons-list-item>
      <v-ons-list-item
        tappable
      >
        <v-ons-icon icon="ion-heart" class="icon"></v-ons-icon>
        {{ favoritePrefix }} favorite
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-dialog>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'item-dialog',
    computed: {
      favoritePrefix: function () {
        return this.favorited ? 'Remove' : 'Add'
      },
      ...mapState({
        dialogVisible: state => state.app.tweetItemDialogVisible,
        favorited: state => state.app.favorited
      })
    },
    methods: {
      closeDialog: function (event) {
        console.log(event)
        this.closeTweetItemDialog()
        this.removeSelectedItem()
      },
      moveTweetInput: function () {
        this.changeActiveIndex(0)
        this.closeTweetItemDialog()
      },
      ...mapActions([
        'changeActiveIndex',
        'closeTweetItemDialog',
        'removeSelectedItem'
      ])
    }
  }
</script>

<style scoped>
  .icon {
    margin-right: 5px;
  }
</style>