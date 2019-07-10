<template>
  <div>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase-config.js'
export default {
  created() {
    let event = {}
    // firebase.database().ref('events/-LjIQTsa9cLyiE9ey6rW').once("value", (get_event => {
    // //   console.log(get_event)
    //   if(get_event == null){
    //     return console.log('bad params');
    //   }else{
    //     event = get_event.val();
    //     console.log(get_event.val())
    //   }
    // }))
    let request_ids = ['U1bfcefbaef4e2ca549b80436e62d5aab', 'aaaa']
    let database = firebase.database()
    let valid_users = []
    request_ids.map( id => {
      database.ref('users/'+id).once("value", user => {
        if(user.val() != null){
          valid_users.push(id)
          }
      });
    });
    console.log(valid_users)
  }
}
</script>

<style>

</style>
