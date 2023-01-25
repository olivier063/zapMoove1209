import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import StorageService from '../services/storageService';

export default class TrainingHistory extends Component {
  constructor(props) {
    super(props)

    //ON CREE UN ARRAY DANS LES STATES POUR Y METTRE TOUTES LES DONNEES DE RUN DATA AFIN DE POUVOIR CREER UNE FLATLIST A PARTIR DE CE TABLEAU
    this.state = {
      allData: []
    }
    this.props.navigation.addListener('focus', () => {
      this.getStorageHistory();
    });
    // console.log("PROPSSSS", this.props) 
    // console.log("STATE", this.state)
  }

  componentDidMount() {
    this.getStorageHistory();
  }

  async getStorageHistory() {
    try {
      const runData = await StorageService.load({ key: 'runData' });
      // console.log("LOAD RUN DATA", runData)

      // ON CLASSE LES DONNEES PAR CURRENTE DATE AVEC LE .SORT SUR RUNDATA
      runData.sort((a, b) => b.currentDate.localeCompare(a.currentDate));
      // console.log("RUN DATA",runData);

      this.setState({
        allData: runData
      })
    } catch (error) {
      console.log("CATCH getStorageHistory", error)
      this.setState({
        allData: []
      })
    }
  }


  render() {
    // console.log("RENDER", this.state.allData)
    // console.log(this.props)
    return (
      <View style={{ backgroundColor: 'white', height: '100%' }}>
        <FlatList
          data={this.state.allData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (

            <View >
              {item.seconds >= 1 ?
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("TRAINING STATE HISTORIQUE", { image: item.image, distance: item.distance, minutes: item.minutes, seconds: item.seconds, hours: item.hours, averageSpeed: item.averageSpeed, paceSpeed: item.paceSpeed, elevationGain: item.elevationGain, h: item.h, m: item.m, s: item.s, currentDate: item.currentDate, index: index, allData: this.state.allData })}
                >
                  <View style={{ flexDirection: 'row', padding: 10, backgroundColor: '#FF6F00', marginLeft: 20, marginRight: 20, marginTop: 15, borderRadius: 7 }}>
                    <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'center' }}>
                      <Image
                        source={require("../assets/runImage.jpeg")}
                        style={styles.image}
                      />
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text style={{ fontSize: 16 }}>
                        Votre course du :  INDEX {index}
                      </Text>
                      <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                        {item.currentDate}
                      </Text>
                      <Text style={{ fontWeight: 'bold' }}>
                        {item.hours < 10 ? `0${item.hours}` : item.hours}:{item.minutes < 10 ? `0${item.minutes}` : item.minutes}:
                        {item.seconds < 10 ? `0${item.seconds}` : item.seconds}
                      </Text>
                    </View>


                    <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{fontSize: 20, fontWeight: 'bold' }}>{">"}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                  : <View style={{ height: '100%', marginTop: 150}}><Text style={{ textAlign: 'center', fontSize: 30, fontWeight: 'bold' }}>Aucun historique,{'\n'} entraînez-vous !</Text></View>
                 } 
            </View>
          )}
        />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  image: {
    height: 40,
    width: 40,
    borderRadius: 50,

  },
})