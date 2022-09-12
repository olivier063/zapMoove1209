import { Text, View } from 'react-native'
import React, { Component } from 'react'
import WebView from 'react-native-webview'


export default class LienYoutube extends Component {
  render() {
    return (
      <WebView source={{uri: "https://www.youtube.com/watch?v=wrwwXE_x-pQ" }} />
    )
  }
}


