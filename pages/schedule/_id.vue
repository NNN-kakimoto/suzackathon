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
        <v-toolbar-title>Schedule on {{ date }}</v-toolbar-title>
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
export default {
  data(){
    return {
      selectable_members: ['Kakimoto', 'Kazu', 'ShirasU'],
      valid: true,
      date: '2019-06-20',
      members: ['Kakimoto'],
      title: 'タイトル',
      detail: "詳細",
      start_time: '10:00',
      budget: '300',
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
