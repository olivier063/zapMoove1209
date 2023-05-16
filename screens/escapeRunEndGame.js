import { Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'

export default class EscapeRunEndGame extends Component {
  render() {
    return (
      <View style={{ backgroundColor: 'white', height: '100%', justifyContent: 'center' }}>

        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>
          FÉLICITATIONS{'\n'} vous avez terminé le jeu !!
        </Text>

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity style={{ backgroundColor: '#FF6F00', height: 50, width: 200, borderRadius: 30, justifyContent: 'center', marginTop: 50 }}
          onPress={() => this.props.navigation.navigate("MENU PRINCIPAL")}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>MENU PRINCIPAL</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}