import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';


export default function TrainingState() {

  const navigation = useNavigation();


  return (
    <View>
      <Image
       source={{ uri: props.image }}
        style={{ height: 200, width: '100%', backgroundColor: '#DAE3EA' }}
      />
      <Text style={{ marginLeft: 10, marginTop: 5 }}>Entraînement</Text>
      <Text style={{ marginLeft: 10 }}>date et heure</Text>

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
        <Text style={{ marginLeft: 10, marginTop: 5 }}>Résumé</Text>
      </View>
      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginTop: 0,
        }}
      >
      </View>

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <View style={{ flex: 1, backgroundColor: '#DAE3EA', margin: 10, borderRadius: 7 }}>
          <Text style={{ textAlign: 'center', fontSize: 16 }}>Distance</Text>
          <Text style={{ textAlign: 'center', fontSize: 19 }}>00.00 m</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#DAE3EA', margin: 10, borderRadius: 7 }}>
          <Text style={{ textAlign: 'center', fontSize: 16 }}>Temps</Text>
          <Text style={{ textAlign: 'center', fontSize: 19 }}>00.00.00</Text>
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

      <View
        style={{
          borderBottomColor: "black",
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginTop: 10,
        }}
      >
      </View>

      <View style={{ flexDirection: 'row', marginTop: 30 }}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: "#FF6F00", height: 40, borderRadius: 7, justifyContent: 'center', margin: 10, borderColor: 'black', borderWidth: 1 }}>
          <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
            ENREGISTRER
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ flex: 1, backgroundColor: "red", height: 40, borderRadius: 7, justifyContent: 'center', margin: 10, borderColor: 'black', borderWidth: 1  }}
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