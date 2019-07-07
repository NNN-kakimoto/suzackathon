<template>
  <v-layout
    wrap
  >
    <v-flex
      xs12
    >
      <v-sheet height="500">
        <v-calendar
          ref="calendar"
          v-model="today"
          :type="'month'"
          :end="'2019-12-31'"
          color="primary"
          @click:date="clickDay"
          @click:day="clickDay"
        >
          <template v-slot:day="{ date }">
            <template v-for="event in eventsMap[date]">
              <v-menu
                :key="event.title"
                v-model="event.open"
                full-width
                offset-x
              >
                <template v-slot:activator="{ on }">
                  <div
                    v-if="!event.time"
                    v-ripple
                    class="my-event"
                    v-on="on"
                    v-html="event.title"
                    v-on:click.stop
                  ></div>
                </template>
                <v-card
                  color="grey lighten-4"
                  class="black--text"
                  min-width="350px"
                  flat
                >
                  <v-toolbar
                    color="purple"
                    dark
                  >
                    <v-btn icon :to="'/schedule/'+event.id">
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-toolbar-title v-html="event.title"></v-toolbar-title>
                  </v-toolbar>
                  <v-card-title primary-title color="gray">
                    <span
                      v-html="event.details"
                      color="black"
                      dark
                    ></span>
                  </v-card-title>
                  <v-card-actions>
                    <v-btn
                      flat
                      color="secondary"
                    >
                      Cancel
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      flat
                      :to="'/schedule/'+event.id"
                      color="primary"
                    >
                      Detail
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </template>
          </template>
        </v-calendar>
      </v-sheet>
    </v-flex>
    <v-flex
      xs6
      class="text-sm-left text-xs-center"
    >
      <v-btn @click="$refs.calendar.prev()">
        <v-icon
          dark
          left
        >
          keyboard_arrow_left
        </v-icon>
        Prev
      </v-btn>
    </v-flex>
    <v-flex
      xs6
      class="text-sm-right text-xs-center"
    >
      <v-btn @click="$refs.calendar.next()">
        Next
        <v-icon
          right
          dark
        >
          keyboard_arrow_right
        </v-icon>
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import firebase from "~/plugins/firebase-config.js"
export default {
  components: {
  },
  data() {
    return {
      today: '',
      events: [],
    }
  },
  created() {
    const date = new Date()
    this.today = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()

    let table = firebase.database().ref('events-calendar/')
    table.once("value").then(data => { 
      const rows = data.val()
      for(let key of Object.keys(rows)) {
        this.events.push({
          id: key,
          title: rows[key].title,
          details: rows[key].detail,
          date: rows[key].date,
          open: false
        })
      }
    } )
  },
  computed:{
    eventsMap(){
      const map = {}
      this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e))
      return map
    }
  },
  methods: {
    clickDay(date){
      // navigate
      this.$router.push('/create/'+date.date)
    },
    open (event) {
      alert(event.title)
    },
  }
}
</script>
<style lang="stylus" scoped>
.my-event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  background-color: purple;
  color: #ffffff;
  border: 1px solid purple;
  width: 100%;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
}
</style>