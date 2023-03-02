import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { Component } from 'react'
import TimerTrainingService from '../services/timerTrainingService';
import taskManagerService from '../services/taskManagerService';
import mapService from '../services/mapService';
import * as Location from 'expo-location';



const LOCATION_TASK_NAME = 'background_location_task';

export default class TimerTraining extends Component {


    timerTrainingService = null;
    constructor(props) {
        super(props);

        // console.log("PROPS TIMER TRAINING", this.props)
        const maxTime = 0;
        this.timerTrainingService = new TimerTrainingService(maxTime);
        // const { navigation } = this.props.navigation;

        this.timerTrainingService.timerChange.subscribe(state => {
            this.setState({
                minutes: this.timerTrainingService.getMinutes(),
                seconds: this.timerTrainingService.getSeconds(),
                hours: this.timerTrainingService.getHours(),
                // startDisable: ((this.timerTrainingService.getSeconds() === 0 && this.timerTrainingService.getMinutes() === 0) || this.timerTrainingService.getSeconds() === maxTime ? false : true)
            })
        })

        this.state = {
            startButton: true,
            pauseButton: true,
            minutes: this.timerTrainingService.getMinutes(),
            seconds: this.timerTrainingService.getSeconds(),
            hours: this.timerTrainingService.getHours(),
            timerDown: null,

            // states pour le calcul du temps total meme si le bouton pause est cliqué.....
            startTime: null,
            endTime: null,
            timeDiff: null,
            h: null,
            m: null,
            s: null,
            //................................................................................
        };
    }

    // le setTimer se fait à la montee du composant sinon erreur: (Can't call setState on a component that is not yet mounted), le setTimer est dans le constructor de timerTrainingService
    componentDidMount() {
        this.timerTrainingService.setTimer();
    }

    // on regarde si la valeur resetTimer du parent est à true, si c'est le cas on remet à zer0 clearInterval pour arreter le decompte
    // de secondes, on passe a false le bouton start, et on reset le timer
    componentDidUpdate(prevProps, prevState) {
        // console.log(this.props)
        if (this.props.resetTimer) {
            this.timerTrainingService.stopTimer();
            this.props.isTimerReset();
        }
        // Calcul du temps total de course meme si le bouton pause est cliqué
        if (prevState.startTime !== this.state.startTime || prevState.endTime !== this.state.endTime) {
            if (this.state.startTime && this.state.endTime) {
                const timeDiff = this.state.endTime - this.state.startTime;
                const h = Math.floor(timeDiff / (60 * 60 * 1000));
                const remainder = timeDiff % (60 * 60 * 1000);
                const m = Math.floor(remainder / (60 * 1000));
                const s = Math.floor((remainder % (60 * 1000)) / 1000);
                this.setState({ timeDiff: timeDiff, h: h, m: m, s: s });
            }
        }
    }

    onButtonStart = async () => {
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
        mapService.userLocation();
        taskManagerService.backgroundLocation();
        //...........................................................................

        this.timerTrainingService.startTimer();

        //...........................................................................
        this.setState({ startButton: false });
        this.setState({ startDisable: true });
        this.setState({ startTime: Date.now() })
    }

    onButtonPause = () => {
        this.timerTrainingService.stopTimer();
        this.setState({ pauseButton: false });
        this.setState({ startDisable: false });
    }

    endPauseRun = () => {
        this.timerTrainingService.startTimer();
        this.setState({ pauseButton: true });
    }

    alertActions = async () => {

        this.timerTrainingService.stopTimer();
        // ON APPEL TASK MANAGER POUR DESENREGISTER LA TACHE ET ARRETER LA GEOLOCALISATION
        taskManagerService.unregisterTask(LOCATION_TASK_NAME)
        const image = await mapService.takeSnapshot();

        const gpx = await mapService.convertToGpx();

        // const image = await this.props.handleCapture();
        // console.log("IMAGE",image)
        this.setState({ startButton: true });
        this.setState({ icone: true });
        this.setState({ endTime: Date.now() });

        // etant donnee le return dans le takeSnapShot, on peut ecrir : {image} direct. De plus, on passe avec les props minutes, seconds et hours qui sont dans les state. on les recupere dans l'enfant avec les props
        this.props.navigation.navigate("TRAINING STATE",
            {
                image: mapService.mapStructure.image,
                distance: mapService.mapStructure.totalRunInMeters,
                minutes: this.state.minutes,
                seconds: this.state.seconds,
                hours: this.state.hours,
                averageSpeed: mapService.mapStructure.averageSpeed,
                paceSpeed: mapService.mapStructure.paceSpeed,
                elevationGain: mapService.mapStructure.elevationGain,
                h: this.state.h,
                m: this.state.m,
                s: this.state.s,
                timeDiff: this.state.timeDiff,
                city: mapService.mapStructure.city,
                path: mapService.mapStructure.path
            });
    }

    stopRun = () => {
        Alert.alert(
            "Attention",
            "Mettre fin à la run ?",
            [
                {
                    text: "NON",
                    onPress: () => this.endPauseRun(),
                    style: "cancel"
                },

                {
                    text: "OUI",
                    onPress: () => this.alertActions()
                }
            ]
        )
    };


    render() {

        const { minutes, seconds, hours } = this.state;

        return (
            <View style={styles.MainContainer}>
                <Text>Temps</Text>
                <Text style={{ textAlign: 'center', fontSize: 40, fontWeight: 'bold' }}>
                    {hours < 10 ? `0${hours}` : hours}:{minutes < 10 ? `0${minutes}` : minutes}:
                    {seconds < 10 ? `0${seconds}` : seconds}</Text>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    {this.state.startButton === true ?
                        <TouchableOpacity
                            style={{
                                marginTop: 0,
                                backgroundColor: "#FF6F00",
                                height: 40,
                                width: 200,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: 'black',
                                borderWidth: 1,
                                borderRadius: 7
                            }}
                            onPress={this.onButtonStart}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Démarrer le run</Text>
                        </TouchableOpacity>
                        :
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={{
                                    marginTop: 0,
                                    backgroundColor: "#FF6F00",
                                    height: 40,
                                    width: 150,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderColor: 'black',
                                    borderWidth: 1,
                                    borderRadius: 7
                                }}
                                onPress={this.onButtonPause}
                            >
                                {this.state.pauseButton === true ?
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Pause</Text>
                                    : <Text style={{ fontSize: 20, fontWeight: 'bold' }}
                                        onPress={this.endPauseRun}>Reprendre</Text>
                                }
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    marginLeft: 10,
                                    backgroundColor: "red",
                                    height: 40,
                                    width: 150,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderColor: 'black',
                                    borderWidth: 1,
                                    borderRadius: 7
                                }}
                                onPressIn={this.onButtonPause}
                                onPress={this.stopRun}
                            >
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Arrêter le run</Text>
                            </TouchableOpacity>

                        </View>
                    }
                </View>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    // button: {
    //     width: '80%',
    //     paddingTop: 8,
    //     paddingBottom: 8,
    //     borderRadius: 7,
    //     marginTop: 10
    // },
    // buttonText: {
    //     color: '#fff',
    //     textAlign: 'center',
    //     fontSize: 20
    // },
    counterText: {
        fontWeight: 'bold',
        fontSize: 30,
        color: '#000'
    }
});


