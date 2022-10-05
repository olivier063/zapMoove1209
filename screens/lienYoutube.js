import { Text, View } from 'react-native'
import React, { Component } from 'react'
import WebView from 'react-native-webview'


export default class LienYoutube extends Component {
  constructor(props) {
    super(props);

    this.state = {
      video: this.props.route.params.linkYoutube,
    };
  }
  render() {
    console.log(this.props.route)
    return (
      <WebView source={{uri: this.state.video }} />
    )
  }
}


