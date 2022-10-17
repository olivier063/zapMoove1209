import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import React, { Component } from 'react'



export default class CountDown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            minutes: 0,
            seconds: 30,
            startDisable: false,
            timerDown: null,
        };
    }

    // on regarde si la valeur resetTimer du parent est à true, si c'est le cas on remet à zer0, clearInterval pour arreter le decompte
    // de secondes, on passe a false le bouton start, et on reset le timer
 componentDidUpdate() {
    console.log(this.props)
    if (this.props.resetTimer) {
        this.setState({seconds: 30})
        clearInterval(this.timerDown)
        this.setState({ startDisable: false })
        this.props.isTimerReset()
    }
 }


    onButtonStart() {
        this.timerDown = setInterval(() => {
            const { seconds, minutes } = this.state

            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }))
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(this.timerDown)
                } else {
                    this.setState(({ minutes }) => ({
                        minutes: minutes - 1,
                        seconds: 59
                    }))
                }
            }
        }, 1000)
        this.setState({ startDisable: true })
    }

    onButtonPause = () => {
        clearInterval(this.state.timerDown);
        this.setState({ startDisable: false })
    }



    render() {
        const { minutes, seconds } = this.state
        return (
            <View style={{flexDirection: 'row', marginTop: 20}}>
                
                <View style={{ flex: 1, alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={()=>this.onButtonPause()}
                        activeOpacity={0.6}
                        style={[styles.button, { backgroundColor: "#FF6F00" }]}>
                        <Text style={styles.buttonText}>PAUSE</Text>
                    </TouchableOpacity>
                </View>
                <View>

                    {/* // condition ternaire: Si minutes et seconds sont à zero, on affiche 'fini' sinon, on affiche le timer */}
                {minutes === 0 && seconds === 0
                    ? <Text>FINI</Text>
                    : <Text style={{ textAlign: 'center', fontSize: 40, fontWeight: 'bold' }}>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</Text>
                }
                </View>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={()=>this.onButtonStart()}
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