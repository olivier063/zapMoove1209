import { Text, View } from 'react-native'
import React, { Component } from 'react'
import WebView from 'react-native-webview';

export default class EscapeRunLienWeb extends Component {
    constructor(props) {
        super(props);
        console.log('PROPS', this.props)
        this.state = {
        url: this.props.route.params.url,
        };
      }

      

  render() {
    console.log('URI LIEN',this.state.url)

    return (
        <WebView source={{uri: this.state.url }} />
    )
  }
}


