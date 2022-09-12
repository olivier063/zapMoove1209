import { Text, View } from 'react-native'
import React, { Component } from 'react'
import WebView from 'react-native-webview'

export default class Compte extends Component {
  render() {
    return (
      <WebView source={{uri: "https://www.zapsports.com/ext/app_page_web/su-creation-compte.htm" }} />
    )
  }
}

