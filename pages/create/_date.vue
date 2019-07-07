<template>
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
        <v-toolbar-title>Create New Schedule on {{ $route.params.date }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          flat
          @click="submit"
        >
          <v-icon>send</v-icon>
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
      ></v-textarea>
      <v-divider></v-divider>
      <v-text-field
        label="Start time"
        full-width
        v-model="schedule.start_time"
        type="time"
        mask="time"
        hint="開始時刻"
        name="start_time"
        ref="start_time"
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
      ></v-text-field>
    </v-form>
  </v-card>
</template>

<script>
import firebase from '~/plugins/firebase-config.js'
export default {
  data () {
    return {
      valid: true,
      selectable_members: ['Kakimoto', 'Kazu', 'ShirasU'],
      schedule: {
        date: this.$route.params.date,
        members: [],
        title: '',
        detail: '',
        start_time: '09:00',
        budget: '0',
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
        }
    }
  },
  mounted() {
    // this.http_client = new HttpClient()
  },
  computed: {
    form () {
      return {
        members: this.schedule.members,
        title: this.schedule.title,
        detail: this.schedule.detail,
        start_time: this.schedule.start_time,
        budget: this.schedule.budget,
        date: this.schedule.date,
      }
    }
  },
  methods: {
    submit () {
      this.formHasErrors = false
      if(this.$refs.form.validate()){
        this.post()
      }
      return false
    },
    async post() {
      let newPostKey = firebase.database().ref().child('events').push().key;

      let updates = {};
      updates['events/'+ newPostKey] = this.schedule
      updates['events-calendar/' + newPostKey] = {
        title: this.schedule.title,
        detail: this.schedule.detail,
        date: this.schedule.date,
      }
      firebase.database().ref().update(updates)
      return this.$router.push('/schedule/' + newPostKey)
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
</style>
