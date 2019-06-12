<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      
      <v-list>
        <!-- <v-list-title v-if="!miniVariant">
          <v-list-tile-action>
            <v-icon @click.stop="miniVariant = !miniVariant">chevron_left</v-icon>
          </v-list-tile-action>
        </v-list-title>
        <v-list-title v-if="miniVariant">
          <v-list-tile-action>
            <v-icon @click.stop="miniVariant = !miniVariant">chevron_right</v-icon>
          </v-list-tile-action>
        </v-list-title> -->

        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon color="white">{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-toolbar-side-icon @click="drawer = !drawer" />
      
      <v-toolbar-title >{{title}}</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
      app
    >
      <span>&copy; 2019 - {{title}}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'calendar_today',
          title: 'Home',
          to: '/'
        },
        {
          icon: 'account_box',
          title: 'Profile',
          to: '/profile'
        },
        {
          icon: 'info',
          title: 'How about?',
          to: '/about'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'suzackathon'
    }
  }
}
</script>
