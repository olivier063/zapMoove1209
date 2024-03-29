import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, PermissionsAndroid, Platform, Share } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import StorageService from '../services/storageService';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { captureScreen } from 'react-native-view-shot';


export default function CourseConnecteeState(props) {

  console.log("PROPS COURSE CONNECTE STATE", props)
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
  const [screenShot, setScreenShot] = useState('');

  const saveRun = async () => {


  }

  shareOptions = () => {
    Alert.alert(
      "JE PARTAGE : ",
      "(Tapez en dehors pour fermer la fenêtre)",
      [
        {
          text: "Mes coordonnées GPX",
          onPress: () => shareGpx(),
        },
        {
          text: "Cet écran",
          onPress: () => hasAndroidPermission(),
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  //PARTAGE de l'ecran à des amis..................................
  hasAndroidPermission = async () => {
    // const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    const permission = Platform.Version >= 33 ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    // console.log("CHECK PERMISSION",  PermissionsAndroid.PERMISSIONS)

    let hasPermission = await MediaLibrary.getPermissionsAsync();
    console.log(hasPermission)
    if (hasPermission.granted !== true) {
      hasPermission = await MediaLibrary.requestPermissionsAsync();
      console.log(hasPermission)
    }
    if (hasPermission.granted === true) {
      console.log("CHECK PERMISSION", permission)
      console.log("HAS PERMISSION", hasPermission)

      try {
        const uriScreen = await captureScreen({
          format: "png",
          quality: 0.8,
        });

        console.log("SCREEN SHOT", uriScreen);
        setScreenShot(uriScreen);

      } catch (error) {
        console.error("Oops, snapshot failed", error);
        Alert.alert("Capture échouée");
      }
      savePicture();
    }
  }

  savePicture = async () => {
    const image = await MediaLibrary.saveToLibraryAsync(screenShot)
    console.log("IMAGE", screenShot)
    if (!screenShot) {
      console.log("Pas d'image enregistrée")
      Alert.alert("Pas d'image enregistrée")
    }
    shareScreenshot();
  };

  shareScreenshot = async () => {
    const isAvailable = await Sharing.isAvailableAsync()
    console.log(isAvailable)
    if (isAvailable === true) {
      try {
        const imageShare = await Sharing.shareAsync(screenShot, {})
      } catch (error) {
        console.log(error)

        Alert.alert(
          'Oups',
          "un problème est survenu, pour repartager cette image, veuillez quitter l'application.",
          [
            {
              text: 'OK',
            }
          ],
        );

      }
    }
  }
  //..................................PARTAGE de l'ecran à des amis

  //Partage des gpx pour ses amis......................................
  shareGpx = async () => {
    try {
      const result = await Share.share({
        title: 'Mes coordonnées GPX',
        message:
          props.route.params.pathGpx,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  //
  gpxToFile = async () => {
    const formData = new FormData();
    formData.append('gpxFile', props.route.params.pathGpx);

    const gpxForm = await formData;
    console.log("GPX FORM DATA", gpxForm);
  }
  //......................................Partage des gpx pour ses amis

  //Envoi des GPX au serveur...........................................



  //...........................................Envoi des GPX au serveur

  return (
    <View style={{ backgroundColor: 'white' }}>
      <View style={{ height: 180, width: '100%' }}>
        <Image
          source={{ uri: props.route.params.image }}
          style={{ height: '100%', width: "100%" }}
        // resizeMode="contain"
        />
      </View>
      <Text style={{ marginLeft: 10, marginTop: 5, fontSize: 15 }}>Entraînement</Text>

      <View style={{ flexDirection: 'row' }}>
        <Text style={{ marginLeft: 10, fontSize: 15, flex: 1 }}>{currentDate}</Text>

        <TouchableOpacity onPress={() => shareOptions()}>
          <Image
            source={require("../assets/partagerIcone.jpeg")}
            resizeMode="contain"
            style={styles.imagePartage}
          />
        </TouchableOpacity>
      </View>
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

      <View style={{ flexDirection: 'row', marginTop: 0 }}>
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

      <View style={{ flexDirection: 'row', marginTop: -15 }}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: "#FF6F00", height: 40, borderRadius: 7, justifyContent: 'center', margin: 10, borderColor: 'black', borderWidth: 1 }}
        // onPress={() => saveRun()}
        >
          <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
            ENREGISTRER
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ flex: 1, backgroundColor: "red", height: 40, borderRadius: 7, justifyContent: 'center', margin: 10, borderColor: 'black', borderWidth: 1 }}
          onPress={() => navigation.navigate("CHOIX COURSE CONNECTEE")}
        >
          <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
            SUPPRIMER
          </Text>
        </TouchableOpacity>
      </View>

    </View>

  )
}

const styles = StyleSheet.create({
  imagePartage: {
    height: 30,
    width: 100,
    marginTop: -15,
  },
})