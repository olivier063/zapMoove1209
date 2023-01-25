import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import TimerService from '../services/timerService';

// export const BASE_SECONDS = 2

export default class CountDown extends Component {
    timerService = null;
    constructor(props) {
        super(props);
        // console.log(this.props)
        const maxTime = 30;

        this.timerService = new TimerService(maxTime);
        this.timerService.timerChange.subscribe(state => {
         
            this.setState({
                minutes: this.timerService.getMinutes(),
                seconds: this.timerService.getSeconds(),
                startDisable: ((this.timerService.getSeconds() === 0 && this.timerService.getMinutes() === 0) || this.timerService.getSeconds() === maxTime ? false : true) 
            })
        })

        this.state = {
            minutes: this.timerService.getMinutes(),
            seconds: this.timerService.getSeconds(),
            startDisable: false,
            timerDown: null,
        };
       
    }

    // on regarde si la valeur resetTimer du parent est à true, si c'est le cas on remet à zer0 clearInterval pour arreter le decompte
    // de secondes, on passe a false le bouton start, et on reset le timer
    componentDidUpdate() {
        // console.log(this.props)
        if (this.props.resetTimer) {
            this.timerService.stopTimer();
            this.setState({ startDisable: false })
            this.props.isTimerReset()
        }
    }

    onButtonStart = () => {
        this.timerService.startTimer();
        this.setState({ startDisable: true });
    }

    onButtonPause = () => {
        this.timerService.stopTimer();
        this.setState({ startDisable: false });
    }


    render() {
        const { minutes, seconds } = this.state;

        //Permet l'ouverture de la modale quand le countDown est à zero
        console.log(this.timerService.getTimerDown())
        if (minutes == 0 && seconds == 0 && this.timerService.getTimerDown() != null) {
            this.timerService.stopTimer(true);
            // console.log("RENDER countDown")
            this.props.openModal(true)
        }
    

        return (
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={() => this.onButtonPause()}
                        activeOpacity={0.6}
                        style={[styles.button, { backgroundColor: "#FF6F00" }]}>
                        <Text style={styles.buttonText}>PAUSE</Text>
                    </TouchableOpacity>
                </View>
                <View>

                    {/* // condition ternaire: Si minutes et seconds sont à zero, on affiche 'fini' sinon, on affiche le timer */}

                    {/* <Text>FINI</Text> */}
                    <Text style={{ textAlign: 'center', fontSize: 40, fontWeight: 'bold' }}>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</Text>

                </View>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={() => this.onButtonStart()}
                        activeOpacity={0.6}
                        style={[
                            styles.button,
                            {
                                backgroundColor: this.state.startDisable ? "#B0BEC5" : "#FF6F00",
                            },
                        ]}
                        disabled={this.state.startDisable}
                    >
                        <Text style={[styles.buttonText]}>START</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        width: 120,
        height: 40,
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 7,
        marginTop: 10
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
});