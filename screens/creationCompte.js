import React, { Component } from 'react';
import { View, StyleSheet, Button, Linking } from 'react-native';
import { Constants } from 'expo';

export default class CreationCompte extends Component {
  render() {
    return (
      <View >
       <Button title="Click me" onPress={ ()=>{ Linking.openURL("https://www.zapsports.com/ext/app_page_web/su-creation-compte.htm")}} />
      </View>
    );
  }
}

