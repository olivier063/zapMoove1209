import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'


export default class ExerciceMenu extends Component {
  render() {
    return (
      <View >
        <View  style={styles.textContainer}>
            <TouchableOpacity onPress={ () => this.props.navigation.navigate('CARTE TRAINING')}>
                <Text style={{marginLeft: 10}}>ENTRAINEMENT</Text>
                <Text style={{marginLeft: 10}}>Course à pied, marche, vélo</Text>
            </TouchableOpacity>
        </View>
        <View  style={styles.textContainer}>
            <TouchableOpacity onPress={ () => this.props.navigation.navigate('CHOISIR UN ENTRAINEMENT')}>
                <Text style={{marginLeft: 10}}>EXERCICES</Text>
                <Text style={{marginLeft: 10}}>Entraînement type Fitness</Text>
            </TouchableOpacity>
        </View>
      </View>
      
    )
  }
}

const styles = StyleSheet.create({

    textContainer: {
        margin: 10,
        borderWidth: 0.5,
        borderColor:'black',
        backgroundColor: 'white',
  
    }

});