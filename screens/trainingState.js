import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import StorageService from '../services/storageService';
import { timestamp } from 'rxjs';


export default function TrainingState(props) {

  console.log("PROPS TRAINING STATE", props)
  const navigation = useNavigation();

  //TIMESTAMP affiché dans le trainingState au dessus du resumé........................................................
  const [currentDate, setCurrentDate] = useState('');


  useEffect(() => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    setCurrentDate(
      date + '/' + month + '/' + year
      + ' ' + hours + ':' + min + ':' + sec
    );
  }, []);
  //........................................................TIMESTAMP


  const saveRun = async () => {
    let datas = [];
    try {
      datas = await StorageService.load({
        key: 'runData',
      })
    } catch {

    }

    const runData = {
      image: props.route.params.image,
      distance: props.route.params.distance,
      hours: props.route.params.hours,
      minutes: props.route.params.minutes,
      seconds: props.route.params.seconds,
      averageSpeed: props.route.params.averageSpeed,
      paceSpeed: props.route.params.paceSpeed,
      elevationGain: props.route.params.elevationGain,
      h: props.route.params.h,
      m: props.route.params.m,
      s: props.route.params.s,
      currentDate: currentDate,
      city: props.route.params.city,

      pathGpx: props.route.params.pathGpx

    };

    datas.push(runData)
    StorageService.save({
      key: 'runData',
      data: datas,
      expires: null,
    });
    navigation.navigate("CHOISIR UN MODE")
  }


  return (
    <View>
      <View style={{ height: 180, width: '100%' }}>
        <Image
          source={{ uri: props.route.params.image }}
          style={{ height: '100%', width: "100%" }}
        // resizeMode="contain"
        />
      </View>
      <Text style={{ marginLeft: 10, marginTop: 5, fontSize: 15 }}>Entraînement</Text>
      <Text style={{ marginLeft: 10, fontSize: 15 }}>{currentDate}</Text>

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
          <Text style={{ textAlign: 'center', fontSize: 19 }}>{props.route.params.distance} m</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#DAE3EA', margin: 10, borderRadius: 7 }}>
          <Text style={{ textAlign: 'center', fontSize: 16 }}>Temps</Text>
          <Text style={{ textAlign: 'center', fontSize: 19 }}>
            {props.route.params.hours < 10 ? `0${props.route.params.hours}` : props.route.params.hours}:{props.route.params.minutes < 10 ? `0${props.route.params.minutes}` : props.route.params.minutes}:
            {props.route.params.seconds < 10 ? `0${props.route.params.seconds}` : props.route.params.seconds}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, backgroundColor: '#DAE3EA', margin: 10, borderRadius: 7 }}>
          <Text style={{ textAlign: 'center', fontSize: 16 }}>Allure moyenne</Text>
          <Text style={{ textAlign: 'center', fontSize: 19 }}>{props.route.params.paceSpeed}'' min/km</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#DAE3EA', margin: 10, borderRadius: 7 }}>
          <Text style={{ textAlign: 'center', fontSize: 16 }}>Dénivelé positif</Text>
          <Text style={{ textAlign: 'center', fontSize: 19 }}>{props.route.params.elevationGain} m</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, backgroundColor: '#DAE3EA', margin: 10, borderRadius: 7 }}>
          <Text style={{ textAlign: 'center', fontSize: 16 }}>Vitesse moyenne</Text>
          <Text style={{ textAlign: 'center', fontSize: 19 }}>{props.route.params.averageSpeed} km/h</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#DAE3EA', margin: 10, borderRadius: 7 }}>
          <Text style={{ textAlign: 'center', fontSize: 16 }}>Temps écoulé</Text>
          <Text style={{ textAlign: 'center', fontSize: 19 }}>
            {props.route.params.h < 10 ? `0${props.route.params.h}` : props.route.params.h}:{props.route.params.m < 10 ? `0${props.route.params.m}` : props.route.params.m}:
            {props.route.params.s < 10 ? `0${props.route.params.s}` : props.route.params.s}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 15 }}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: "#FF6F00", height: 40, borderRadius: 7, justifyContent: 'center', margin: 10, borderColor: 'black', borderWidth: 1 }}
          onPress={() => saveRun()}
        >
          <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
            ENREGISTRER
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ flex: 1, backgroundColor: "red", height: 40, borderRadius: 7, justifyContent: 'center', margin: 10, borderColor: 'black', borderWidth: 1 }}
          onPress={() => navigation.navigate("CHOISIR UN MODE")}
        >
          <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
            SUPPRIMER
          </Text>
        </TouchableOpacity>
      </View>

    </View>

  )
}