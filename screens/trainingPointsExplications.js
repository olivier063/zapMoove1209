import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { Observable } from 'rxjs'

export default class TrainingPointsExplications extends Component {

isValid = () => {
  console.log(isValid)
}

  render() {
    return (
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 30, fontWeight: 'bold', marginTop: 10}}>DETAILS</Text>
        
         <Text style={{marginTop: 10, fontSize: 16}}> Bienvenu.e sur votre page d'entrainement</Text>
          <Text style={{marginTop: 5, fontSize: 16}}> 
          Vous pouvez acceder aux exercices selon différents niveaux
          de difficultés.{"\n"}
          Pour se faire, il vous faut debloquer des points en terminant dans son intégralité les différents programmes
          afin de passer au niveau de difficulté supérieur.{"\n"}
          Amusez-vous bien !!
          </Text>
      </View>
    )
  }
}