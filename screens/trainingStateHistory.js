import { Alert, Image, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Platform, Share } from 'react-native'
import React, { Component } from 'react'
import StorageService from '../services/storageService';
import { captureScreen } from 'react-native-view-shot';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

export default class TrainingStateHistory extends Component {
  constructor(props) {
    super(props)
    // console.log("PROPS TRAINING STATE HISTORY", this.props)
    this.state = {
      screenShot: null,
    }
  }


  deleteRun = async (index) => {
    try {
      let runDataArray = await StorageService.load({
        key: 'runData'
      }); //Récupère le tableau de stockage
      // console.log(index)

      runDataArray.splice(index, 1); //Supprime la valeur du tableau
      await StorageService.save({
        key: 'runData',
        data: runDataArray
      });

    } catch {

    }
    this.props.navigation.navigate("TRAINING HISTORIQUE")
  }




  shareOptions = () => {
    Alert.alert(
      "JE PARTAGE : ",
      "(Tapez en dehors pour fermer la fenêtre)",
      [
        {
          text: "ajouter exercice dans course",
          onPress: () => this.props.navigation.navigate("COURSE GPX",{pathGpx: this.props.route.params.pathGpx}),
        },
        {
          text: "Mes coordonnées GPX",
          onPress: () => this.shareGpx(),
        },
        {
          text: "Cet écran",
          onPress: () => this.hasAndroidPermission(),
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
        this.setState({ screenShot: uriScreen });

      } catch (error) {
        console.error("Oops, snapshot failed", error);
        Alert.alert("Capture échouée");
      }
      this.savePicture()
    }
  }

  savePicture = async () => {
    const image = await MediaLibrary.saveToLibraryAsync(this.state.screenShot)
    console.log("IMAGE", this.state.screenShot)
    if (!this.state.screenShot) {
      console.log("Pas d'image enregistrée")
      Alert.alert("Pas d'image enregistrée")
    }
    this.shareScreenshot();
  };

  shareScreenshot = async () => {
    const isAvailable = await Sharing.isAvailableAsync()
    console.log(isAvailable)
    if (isAvailable === true) {
      try {
        const imageShare = await Sharing.shareAsync(this.state.screenShot, {})
      } catch(error){
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

  shareGpx = async () => {
    try {
      const result = await Share.share({
        title: 'Mes coordonnées GPX',
        message:
        this.props.route.params.pathGpx,
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
  //..................................PARTAGE de l'ecran à des amis


  //image-picker..............................................(Permet de modifier la taille de l'image que l'on envoi, mais peu pertinent pour le partage de screenShot)
  pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    // console.log("RESULT", result);
    // const uri = result.uri;
    // return uri;
  };
  //..............................................image-picker


  render() {
    // console.log("INDEX", this.props.route.params.index)
    // console.log("ALL DATA", this.props.route.params.allData)


    return (

      <View style={{ backgroundColor: 'white', height: '100%' }}>

        <Image
          source={{ uri: this.props.route.params.image }}
          style={{ height: 165, width: '100%' }}
        // resizeMode="contain"
        />
        <Text style={{ marginLeft: 10, marginTop: 5, fontSize: 15 }}>Entraînement</Text>

        <View style={{ flexDirection: 'row' }}>
          <Text style={{ marginLeft: 10, fontSize: 15, flex: 1 }}>{this.props.route.params.currentDate}</Text>

          <TouchableOpacity onPress={() => this.shareOptions()}>
            <Image
              source={require("../assets/partagerIcone.jpeg")}
              resizeMode="contain"
              style={styles.imageHistorique}
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
          // onPress={() => this.share()}
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

const styles = StyleSheet.create({
  imageHistorique: {
    height: 30,
    width: 100,
    marginTop: -15,
  },

})