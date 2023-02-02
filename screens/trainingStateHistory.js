import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import StorageService from '../services/storageService';

export default class TrainingStateHistory extends Component {
  constructor(props) {
    super(props)
    console.log("PROPS", this.props)
    this.state = {

    }
  }


  deleteRun = async (index) => {
    try {
      let runDataArray = await StorageService.load({
        key: 'runData'
      }); //Récupère le tableau de stockage
      console.log(index)

      runDataArray.splice(index, 1); //Supprime la valeur du tableau
      await StorageService.save({
        key: 'runData',
        data: runDataArray
      });
    
    } catch {

    }
    this.props.navigation.navigate("TRAINING HISTORIQUE")
  }


  render() {
    console.log("INDEX", this.props.route.params.index)
    console.log("ALL DATA", this.props.route.params.allData)
    return (
      <View>
        <Image
          source={{ uri: this.props.route.params.image }}
          style={{ height: 165, width: '100%' }}
        // resizeMode="contain"
        />
        <Text style={{ marginLeft: 10, marginTop: 5, fontSize: 15 }}>Entraînement</Text>
        <Text style={{ marginLeft: 10, fontSize: 15 }}>{this.props.route.params.currentDate}</Text>

        {/* ce style permet d'ajouter une ligne separatrice */}
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginTop: 5,
          }}
        >
        </View>

        <View style={{ backgroundColor: '#DAE3EA', height: 30 }}>
          <Text style={{ marginLeft: 10, marginTop: 5, fontSize: 15, textAlign: 'center' }}>Résumé</Text>
        </View>
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginTop: 0,
          }}
        >
        </View>

        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <View style={{ flex: 1, backgroundColor: '#DAE3EA', margin: 10, borderRadius: 7 }}>
            <Text style={{ textAlign: 'center', fontSize: 16 }}>Distance</Text>
            <Text style={{ textAlign: 'center', fontSize: 19 }}>{this.props.route.params.distance} m</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#DAE3EA', margin: 10, borderRadius: 7 }}>
            <Text style={{ textAlign: 'center', fontSize: 16 }}>Temps</Text>
            <Text style={{ textAlign: 'center', fontSize: 19 }}>
              {this.props.route.params.hours < 10 ? `0${this.props.route.params.hours}` : this.props.route.params.hours}:{this.props.route.params.minutes < 10 ? `0${this.props.route.params.minutes}` : this.props.route.params.minutes}:
              {this.props.route.params.seconds < 10 ? `0${this.props.route.params.seconds}` : this.props.route.params.seconds}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, backgroundColor: '#DAE3EA', margin: 10, borderRadius: 7 }}>
            <Text style={{ textAlign: 'center', fontSize: 16 }}>Allure moyenne</Text>
            <Text style={{ textAlign: 'center', fontSize: 19 }}>{this.props.route.params.paceSpeed}'' min/km</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#DAE3EA', margin: 10, borderRadius: 7 }}>
            <Text style={{ textAlign: 'center', fontSize: 16 }}>Dénivelé positif</Text>
            <Text style={{ textAlign: 'center', fontSize: 19 }}>{this.props.route.params.elevationGain} m</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, backgroundColor: '#DAE3EA', margin: 10, borderRadius: 7 }}>
            <Text style={{ textAlign: 'center', fontSize: 16 }}>Vitesse moyenne</Text>
            <Text style={{ textAlign: 'center', fontSize: 19 }}>{this.props.route.params.averageSpeed} km/h</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#DAE3EA', margin: 10, borderRadius: 7 }}>
            <Text style={{ textAlign: 'center', fontSize: 16 }}>Temps écoulé</Text>
            <Text style={{ textAlign: 'center', fontSize: 19 }}>
              {this.props.route.params.h < 10 ? `0${this.props.route.params.h}` : this.props.route.params.h}:{this.props.route.params.m < 10 ? `0${this.props.route.params.m}` : this.props.route.params.m}:
              {this.props.route.params.s < 10 ? `0${this.props.route.params.s}` : this.props.route.params.s}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 5, alignItems: 'center' }}>
          <TouchableOpacity style={{ backgroundColor: "red", height: 40, width: 250, borderRadius: 7, justifyContent: 'center', margin: 0, borderColor: 'black', borderWidth: 1 }}
            onPress={() => this.deleteRun(this.props.route.params.index)}
          >
            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
              SUPPRIMER
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    )
  }
}