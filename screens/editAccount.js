
import React, { Component } from 'react'
import WebView from 'react-native-webview'

export default class EditAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      idUser: this.props.route.params.idUser
    };
  }
  
  
  render() {
  
    return (
        <WebView source={{uri: `https://www.zapsports.com/ext/app_page_web/su-creation-compte.htm?ID_USER=${this.state.idUser}`}}
        />
    )
  }
}
