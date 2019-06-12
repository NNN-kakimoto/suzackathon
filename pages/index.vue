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
                    <v-btn icon :to="'/schedule/edit/'+event.id">
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-toolbar-title v-html="event.title"></v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon>
                      <v-icon>favorite</v-icon>
                    </v-btn>
                    <v-btn icon>
                      <v-icon>more_vert</v-icon>
                    </v-btn>
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
// import HttpClient from '@/apis/Httpclient'
export default {
  components: {
  },
  data() {
    return {
      today: '',
      response: [],
      events: [
        {
          id: '1',
          title: 'Vacation',
          details: 'Going to the beach!',
          date: '2019-05-30',
          open: false
        },
        {
          id: '2',
          title: 'Vacation',
          details: 'Going to the beach!',
          date: '2019-05-31',
          open: false
        },
        {
          id: '3',
          title: 'Vacation',
          details: 'Going to the beach!',
          date: '2019-06-01',
          open: false
        },
        {
          id: '4',
          title: 'Meeting',
          details: 'Spending time on how we do not have enough time',
          date: '2019-06-07',
          open: false
        },
        {
          id: '5',
          title: '30th Birthday',
          details: 'Celebrate responsibly',
          date: '2019-06-03',
          open: false
        },
        {
          id: '6',
          title: 'New Year',
          details: 'Eat chocolate until you pass out',
          date: '2019-06-01',
          open: false
        },
        {
          id: '7',
          title: 'Conference',
          details: 'Mute myself the whole time and wonder why I am on this call',
          date: '2019-06-21',
          open: false
        },
        {
          id: '8',
          title: 'Hackathon',
          details: 'Code like there is no tommorrow',
          date: '2019-07-01',
          open: false
        }
      ]
    }
  },
  created() {
    // this.http_client = new HttpClient()
    const date = new Date()
    this.today = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
    this.getSchedules()
  },
  computed:{
    eventsMap () {
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
    async getSchedules(){
      // this.response = await this.http_client.getSchedules()
      // console.log(this.response)
      // if(this.response.error != undefined){
      //   this.events = this.response
      // }else{
      //   console.log('何か問題が発生したようです')
      // }
    }
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