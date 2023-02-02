import { Text, View, Image, StyleSheet } from 'react-native'
import React, { Component } from 'react'

export default class Logo extends Component {
  render() {
    return (
      <View>
         <View style={{backgroundColor: 'white'}}>
            <Image
            source={require('../assets/BlockMarque-ZapMoove.jpg')}
            style={styles.imagePrincipale}
            />   
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({

    imagePrincipale:{

        height: 140,
        width: 300,
        marginTop: 30,
        alignSelf: 'center',
        resizeMode:'contain',
    },

});