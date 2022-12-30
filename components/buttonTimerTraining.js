import { Alert, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import TimerTraining from './timerTraining'


export default class ButtonTimerTraining extends Component {
    constructor(props) {
        super(props)
        
       
        this.state = {
           startButton: true,
           pauseButton: true,
           icone: true,

        }
    }


    startRun = () => {
        this.props.user()
        this.setState({startButton : false});
    }

    pauseRun = () => {
        this.setState({pauseButton : false});
    }

    endPauseRun = () => {
        this.setState({pauseButton : true});
    }

    alertActions = () => {
        this.setState({startButton : true});
        this.setState({icone : true});
    }

    stopRun = () => {
        Alert.alert(
            "Attention",
            "Mettre fin à la run ?",
            [
                {
                    text: "NON",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },

                {
                    text: "OUI",
                    onPress: () => this.alertActions()
                }
            ]
        )};

    saveRun = () => {
        
    }

  render() {

    return (
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
                        onPress={this.startRun}
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
                            onPress={this.pauseRun}
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
                            onPress={this.stopRun}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Arrêter la run</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View> 
    )
  }
}