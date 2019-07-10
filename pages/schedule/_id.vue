<template>
  <div>
    <v-card>
      <v-form
        ref="form"
        lazy-validation
        v-model="valid"
      >
        <v-toolbar
          card
          color="purple"
          dark
        >
          <v-btn
            to="/"
            flat
          >
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title>Schedule on {{ schedule.date }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            flat
            @click="line_notice"
          >
            <v-icon color="green">sms</v-icon>
          </v-btn>
        </v-toolbar>
        <v-autocomplete
          v-model="schedule.members"
          :items="selectable_members"
          chips
          label="Member"
          full-width
          hide-details
          hide-no-data
          hide-selected
          multiple
          :rules="[rules.arr_required]"
          ref="members"
          name="members"
          @change="update"
        ></v-autocomplete>
        <v-divider></v-divider>
        <v-text-field
          label="Title"
          v-model="schedule.title"
          full-width
          hint="タイトル"
          name="title"
          ref="title"
          :rules="[rules.required]"
          @change="update"
        ></v-text-field>
        <v-divider></v-divider>
        <v-textarea
          v-model="schedule.detail"
          label="Detail"
          counter
          maxlength="240"
          full-width
          hint="詳細"
          name="detail"
          ref="detail"
          :rules="[rules.required]"
          @change="update"
        ></v-textarea>
        <v-divider></v-divider>
        <v-text-field
          label="Start time"
          full-width
          v-model="schedule.start_time"
          type="time"
          mask="time"
          value="09:00:00"
          hint="開始時刻"
          name="start_time"
          ref="start_time"
          @change="update"
        ></v-text-field>
        <v-divider></v-divider>
        <v-text-field
          label="Budget / person"
          suffix="円"
          type="number"
          v-model="schedule.budget"
          full-width
          :rules="[rules.number]"
          hint="一人あたりの予算"
          name="budget"
          ref="budget"
          @change="update"
        ></v-text-field>
      </v-form>
    </v-card>
    <v-layout
      row
      justify-end
    >
      <v-dialog
        v-model="dialog"
        persistent
        max-width="290"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            color="red"
            flat
            class="delete_btn"
            dark v-on="on"
          >
            DELETE
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">Realy delete this schedule?</v-card-title>
          <v-card-text>削除すると元にもどすのが面倒になります。</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="dialog = false">CANSEL</v-btn>
            <v-btn color="red" flat @click="dialog = false;deleteSchedule()">OK, DELETE</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import firebase from '~/plugins/firebase-config.js'
import axios from 'axios'
export default {
  data(){
    return {
      selectable_members: [],
      line_id_list: {},
      valid: true,
      schedule: {
        date: '',
        members: [],
        title: '',
        detail: "",
        start_time: '',
        budget: '',
      },
      formHasErrors: false,
      rules: {
        required: value => !!value || '必須項目です',
        number: (value) => {
          const pattern = /^[0-9]+$/
          return pattern.test(value) || '半角数字で入力してください'
        },
        counter: value => value.length <= 240 || '最大240文字です',
        arr_required: value => value.length >= 1 || '誰か一人は設定してください',
      },
      dialog: false,
      line_notice_url: 'https://asia-northeast1-suzackathon.cloudfunctions.net/linePushNotice'
    }
  },
  mounted() {
    this.getShcedule()
    this.getMember()
  },
  methods: {
    getMember(){
      firebase.database().ref('users').on("value", (users => {
        const ids = users.val()
        for(const[id, member] of Object.entries(ids)){
          this.selectable_members.push(member.name)
          this.line_id_list[member.name] = id
        }
      }) )
    },
    getShcedule(){
      this.id = this.$route.params.id
      let table = firebase.database().ref('events/'+ this.id)
      table.on("value", ( data => { 
        this.schedule = data.val()
      }) )
    },
    submit () {
      this.formHasErrors = false
      if(this.$refs.form.validate()){
        this.update()
      }
      return false
    },
    update() {
      let updates = {};
      updates['events/'+ this.id] = this.schedule
      updates['events-calendar/' + this.id] = {
        title: this.schedule.title,
        detail: this.schedule.detail,
        date: this.schedule.date,
      }
      firebase.database().ref().update(updates)
    },
    async line_notice(){
      //ライン通知する
      let line_ids = [];
      this.schedule.members.map(member => {
        line_ids.push(this.line_id_list[member])
      });
      if(line_ids.length > 0){
        let body = { ids: line_ids } //JSON.stringify(body)
        const response = await this.$axios.$get('https://asia-northeast1-suzackathon.cloudfunctions.net/lineNotice')
        console.log(response.data)
      }
    },
    deleteSchedule(){
      firebase.database().ref('events/' + this.id).remove()
      firebase.database().ref('events-calendar/' + this.id).remove()
      return this.$router.push('/')
    },
  }
}
</script>

<style>
.v-textarea textarea, .v-text-field__prefix{
  margin-top: 22px !important;
}
.v-messages__message, .v-label{
  color: #fff200
}
.delete_btn{
  margin-right: 0;
}
</style>
