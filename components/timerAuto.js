import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'

export default class TimerAuto extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timer: null,
            minutes_Counter: '00',
            seconds_Counter: '00',
            startDisable: false
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    componentDidMount = () => {

        let timer = setInterval(() => {

            var num = (Number(this.state.seconds_Counter) + 1).toString(),
                count = this.state.minutes_Counter;

            if (Number(this.state.seconds_Counter) == 59) {
                count = (Number(this.state.minutes_Counter) + 1).toString();
                num = '00';
            }

            this.setState({
                minutes_Counter: count.length == 1 ? '0' + count : count,
                seconds_Counter: num.length == 1 ? '0' + num : num
            });
        }, 1000);
        this.setState({ timer });

        this.setState({ startDisable: true })
    }


    render() {

        return (
            <View style={styles.MainContainer}>

                <Text style={styles.counterText}>{this.state.minutes_Counter} : {this.state.seconds_Counter}</Text>

            </View>

        );
    }
}



const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    button: {
        width: '80%',
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 7,
        marginTop: 10
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20
    },
    counterText: {

        fontSize: 20,
        color: '#000'
    }
});