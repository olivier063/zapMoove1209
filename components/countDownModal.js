import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import CountDown from './countDown';




export default class CountDownModal extends Component {

    timerDown = null;

    constructor(props) {
        super(props);

        console.log(this.props)
        this.state = {
            minutes: 0,
            seconds: 10,
            startDisable: false,
            timerDown: null
        };
    }


    componentDidMount = () => {
        console.log('TOTOTOT')
        this.timerDown = setInterval(() => {
            const { seconds, minutes } = this.state

            if (seconds > 0) {
                // this.setState(({ seconds }) => ({
                    // seconds: seconds - 1
                // }))
                this.setState({seconds: seconds -1})
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    console.log('yooooooooooooo')
                    clearInterval(this.timerDown)
                } else {
                    this.setState(({ minutes }) => ({
                        minutes: minutes - 1,
                        seconds: 59
                    }))
                }
            }
        }, 1000)
       
    }

  
    render() {
        console.log("RENDER")
        const { minutes, seconds } = this.state
        // on ajoute la condition timerDown different de null pour eviter la boucle
        if (minutes == 0 && seconds == 0 && this.timerDown !== null){
            clearInterval(this.timerDown)
            this.timerDown = null
            // permet d'utiliser la fonction du parent closeModal
            this.props.closeModal()
        }
        return (

            <View style={{ flexDirection: 'row', marginTop: 20,}}>
                <View>
                <Text style={{ textAlign: 'center', fontSize: 40, fontWeight: 'bold' }}>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</Text>
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