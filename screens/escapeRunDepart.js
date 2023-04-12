import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import mapService from '../services/mapService';
import taskManagerService from '../services/taskManagerService';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background_location_task';


export default class EscapeRunDepart extends Component {
    constructor(props) {
        super(props);
        console.log('PROPS EXPLICATION', this.props)
        this.state = {
            banniere: this.props.route.params.banniere,
            scenario: this.props.route.params.scenario,

        };
    }

    onButtonFindMe = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        mapService.status = status
        //   console.log("MAP SERVICE",mapService.status)
        if (mapService.status !== 'granted') {
            mapService.status = 'Permission to access location was denied';
            return;
        } else {
            const requestPermissions = async () => {

                const { status } = await Location.requestBackgroundPermissionsAsync();
                mapService.status = status
                console.log("STATUS BACK", mapService.status)
                if (mapService.status === 'granted') {
                    // LE TIME INTERVAL DEFINI QUE LA MIS A JOUR DE LA POSITION SE FERA TOUS LES X SECONDES (1000 = 1 SECONDE)
                    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                        accuracy: Location.Accuracy.BestForNavigation,
                        timeInterval: 1000,
                    });
                }
            };
            requestPermissions()
            console.log('Access granted!!')
            console.log('STATUS', mapService.status)
        }

        mapService.userLocationEscape();
        // taskManagerService.backgroundLocation();
        // this.timerTrainingService.startTimer();

        this.props.navigation.navigate('ESCAPE RUN MAP POSITION',
        {
            banniere: this.state.banniere,
            scenario: this.state.scenario,
        })
    }

    onButtonStartEscape = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        mapService.status = status
        //   console.log("MAP SERVICE",mapService.status)
        if (mapService.status !== 'granted') {
            mapService.status = 'Permission to access location was denied';
            return;
        } else {
            const requestPermissions = async () => {

                const { status } = await Location.requestBackgroundPermissionsAsync();
                mapService.status = status
                console.log("STATUS BACK", mapService.status)
                if (mapService.status === 'granted') {
                    // LE TIME INTERVAL DEFINI QUE LA MIS A JOUR DE LA POSITION SE FERA TOUS LES X SECONDES (1000 = 1 SECONDE)
                    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                        accuracy: Location.Accuracy.BestForNavigation,
                        timeInterval: 1000,
                    });
                }
            };
            requestPermissions()
            console.log('Access granted!!')
            console.log('STATUS', mapService.status)
        }

        mapService.userLocationEscape();
        // taskManagerService.backgroundLocation();
        // this.timerTrainingService.startTimer();

        this.props.navigation.navigate('ESCAPE RUN ENIGME',
        {
            banniere: this.state.banniere,
            scenario: this.state.scenario,
        })
    }

    stopJeu = () => {
        Alert.alert(
            "Attention",
            "Mettre fin au jeu ?",
            [
                {
                    text: "NON",
                    style: "cancel"
                },

                {
                    text: "OUI",
                    onPress: () => this.props.navigation.navigate('MENU PRINCIPAL')
                }
            ]
        )
    };

    render() {
        return (
            <View style={{ backgroundColor: 'white', height: '100%', alignItems: 'center' }}>
                <Image
                    source={{ uri: this.state.banniere }}
                    style={styles.banniere}
                    resizeMode="contain"
                />

                <TouchableOpacity style={{ alignItems: 'center' }}
                onPress={() => this.onButtonFindMe()}
                >
                    <Image source={require("../assets/map.png")}
                        resizeMode="contain"
                        style={styles.image} />
                    <Text>où suis-je</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={{
                        marginTop: 20,
                        backgroundColor: "#FF6F00",
                        height: 50,
                        width: 300,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: 'black',
                        borderWidth: 1,
                        borderRadius: 7,
                    }}
                onPress={() => this.onButtonStartEscape() }
                >
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'white'
                    }}>Je suis au départ et souhaite commencer le jeu</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={{
                        marginTop: 50,
                        backgroundColor: "red",
                        height: 50,
                        width: 300,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: 'black',
                        borderWidth: 1,
                        borderRadius: 7
                    }}
                    onPress={() => this.stopJeu()}
                >
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'white'
                    }}>ARRETER LE JEU</Text>
                </TouchableOpacity>

            </View>
        )
    }
}



const styles = StyleSheet.create({
    banniere: {
        height: 150,
        width: "90%",
        margin: 20,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 7,
    },

    image: {
        height: 40,
        width: 100,
        borderRadius: 50,
    },
})