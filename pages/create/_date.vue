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
        <v-toolbar-title>New Schedule on {{ $route.params.date }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          flat
          @click="submit"
        >
          <v-icon>send</v-icon>
        </v-btn>
      </v-toolbar>
      <v-autocomplete
        v-model="members"
        :items="selectable_members"
        chips
        label="Member"
        full-width
        hide-details
        hide-no-data
        hide-selected
        multiple
        :rules="[rules.required]"
        ref="members"
        name="members"
      ></v-autocomplete>
      <v-divider></v-divider>
      <v-text-field
        label="Title"
        v-model="title"
        full-width
        hint="タイトル"
        name="title"
        ref="title"
        :rules="[rules.arr_required]"
      ></v-text-field>
      <v-divider></v-divider>
      <v-textarea
        v-model="detail"
        label="Detail"
        counter
        maxlength="240"
        full-width
        hint="詳細"
        name="detail"
        ref="detail"
        :rules="[rules.counter]"
      ></v-textarea>
      <v-divider></v-divider>
      <v-text-field
        label="Start time"
        full-width
        v-model="start_time"
        type="time"
        mask="time"
        value="09:00:00"
        hint="開始時刻"
        name="start_time"
        ref="start_time"
      ></v-text-field>
      <v-divider></v-divider>
      <v-text-field
        label="Budget / person"
        suffix="円"
        type="number"
        v-model="budget"
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
// import HttpClient from '@/apis/Httpclient'
export default {
  data () {
    return {
      valid: true,
      members: ['Kakimoto'],
      selectable_members: ['Kakimoto', 'Kazu', 'ShirasU'],
      title: 'Robotino勉強会(リフト)',
      detail:  "Robotinoの追加装備としてリフトを作成し、取り付ける。\n材料等は前日までに柿元が日本橋で購入し、持参する。\nかかった費用については当日請求する。",
      start_time: '09:00',
      budget: '0',
      formHasErrors: false,
      rules: {
          required: value => !!value || '必須項目です',
          number: (value) => {
            const pattern = /^[0-9]+$/
            return pattern.test(value) || '半角数字で入力してください'
          },
          counter: value => value.length <= 240 || '最大240文字です',
          arr_required: value => value.length >= 2 || '誰か一人は設定してください',
        }
    }
  },
  mounted() {
    // this.http_client = new HttpClient()
  },
  computed: {
    form () {
      return {
        members: this.members,
        title: this.title,
        detail: this.detail,
        start_time: this.start_time,
        budget: this.budget,
        date: this.$route.date,
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
      // this.response = await this.http_client.postSchedule(this.$refs.form)
      // if (this.response.status === 200) {
      //   this.$router.replace({ path: `/` })
      // }
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
