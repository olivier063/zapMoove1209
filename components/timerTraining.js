import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { Component } from 'react'
import TimerTrainingService from '../services/timerTrainingService';




export default class TimerTraining extends Component {

    timerTrainingService = null;
    constructor(props) {
        super(props);

        console.log("PROPS",this.props)
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
        };
    }

    // le setTimer se fait à la montee du composant sinon erreur: (Can't call setState on a component that is not yet mounted), le setTimer est dans le constructor de timerTrainingService
    componentDidMount() {
        this.timerTrainingService.setTimer();
    }


    // on regarde si la valeur resetTimer du parent est à true, si c'est le cas on remet à zer0 clearInterval pour arreter le decompte
    // de secondes, on passe a false le bouton start, et on reset le timer
    componentDidUpdate() {
        // console.log(this.props)
        if (this.props.resetTimer) {
            this.timerTrainingService.stopTimer();
            this.props.isTimerReset()
        }
    }

    // this.props.user permet de recuperer la fonction userLocation de trainingMapView2 que l'on a passé dans le composant
    onButtonStart = () => {
        this.props.user()
        this.timerTrainingService.startTimer();
        this.setState({ startButton: false });
        this.setState({ startDisable: true });
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

    // const { navigate } = this.props.navigation;
    // this.props.snapshot permet de recuperer la fonction takeSnapshot de trainingMapView2 que l'on a passé dans le composant
    alertActions = () => {
        this.timerTrainingService.stopTimer();
        // this.props.snapshot();
        this.setState({ startButton: true });
        this.setState({ icone: true });

        this.props.setImage(uri);
        this.props.navigation.navigate("TRAINING STATE", { image: this.props.image });

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
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Démarrer la run</Text>
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
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Arrêter la run</Text>
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

