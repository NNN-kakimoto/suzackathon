export default function({ $axios, redirect }) {
    $axios.setToken('access_token')
    $axios.onResponse(config => {
      $axios.setHeader('Access-Control-Allow-Origin', 'asia-northeast1-suzackathon.cloudfunctions.net')
    })
  }