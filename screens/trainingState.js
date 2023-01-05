import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';


export default function TrainingState(props) {

  console.log("PROPS TRAINING STATE", props)
  const navigation = useNavigation();

  const historique = () => {
    if (!isloading){
      console.log("chargement en cours")
    } else if (isloading){
      console.log("chargement termine")
    } else if (isNotLoading){
      console.log('fin de chargement')
    }
  }

  //TIMESTAMP........................................................
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



  return (
    <View>
      <Image
        source={{ uri: props.route.params.image }}
        style={{ height: 150, width: "100%" }}
      // resizeMode="contain"
      />
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
          <Text style={{ textAlign: 'center', fontSize: 19 }}>{props.route.params.distance}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#DAE3EA', margin: 10, borderRadius: 7 }}>
          <Text style={{ textAlign: 'center', fontSize: 16 }}>Temps</Text>
          <Text style={{ textAlign: 'center', fontSize: 19 }}>

            {props.route.params.hours < 10 ? `0${props.route.params.hours}` : props.route.params.hours}:{props.route.params.minutes < 10 ? `0${props.route.params.minutes}` : props.route.params.minutes}:
            {props.route.params.seconds < 10 ? `0${props.route.params.seconds}` : props.route.params.seconds}
            {/* {props.route.params.hours}:
            {props.route.params.minutes}:
            {props.route.params.seconds} */}

          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, backgroundColor: '#DAE3EA', margin: 10, borderRadius: 7 }}>
          <Text style={{ textAlign: 'center', fontSize: 16 }}>Allure moyenne</Text>
          <Text style={{ textAlign: 'center', fontSize: 19 }}>0'00''</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#DAE3EA', margin: 10, borderRadius: 7 }}>
          <Text style={{ textAlign: 'center', fontSize: 16 }}>Dénivelé positif</Text>
          <Text style={{ textAlign: 'center', fontSize: 19 }}>0.00</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, backgroundColor: '#DAE3EA', margin: 10, borderRadius: 7 }}>
          <Text style={{ textAlign: 'center', fontSize: 16 }}>Vitesse moyenne</Text>
          <Text style={{ textAlign: 'center', fontSize: 19 }}>0,00 km/h</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#DAE3EA', margin: 10, borderRadius: 7 }}>
          <Text style={{ textAlign: 'center', fontSize: 16 }}>Temps écoulé</Text>
          <Text style={{ textAlign: 'center', fontSize: 19 }}>00.00.00</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', marginTop: -5 }}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: "#FF6F00", height: 40, borderRadius: 7, justifyContent: 'center', margin: 10, borderColor: 'black', borderWidth: 1 }}
          onPress={() => navigation.navigate("MENU PRINCIPAL")}
        >
          <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
            ENREGISTRER
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ flex: 1, backgroundColor: "red", height: 40, borderRadius: 7, justifyContent: 'center', margin: 10, borderColor: 'black', borderWidth: 1 }}
          onPress={() => navigation.navigate("MENU PRINCIPAL")}
        >
          <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
            SUPPRIMER
          </Text>
        </TouchableOpacity>
      </View>

    </View>

  )
}