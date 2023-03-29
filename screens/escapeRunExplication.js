import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'


export default class EscapeRunExplication extends Component {
    constructor(props) {
        super(props);
        console.log('PROPS', this.props)
        this.state = {
            infoFr: this.props.route.params.infoFr,
            banniere: this.props.route.params.banniere,
            scenario: this.props.route.params.scenario,

        };
    }



    render() {
        const { navigate } = this.state
        return (
            <View style={{ alignItems: 'center', backgroundColor: 'white', height: '100%' }}>
                <Image
                    source={{ uri: this.state.banniere }}
                    style={styles.banniere}
                    resizeMode="contain"
                />
                <Text style={{ margin: 20 }}>{this.state.infoFr}</Text>


                <TouchableOpacity
                    style={{
                        marginTop: 20,
                        backgroundColor: "#FF6F00",
                        height: 40,
                        width: 200,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: 'black',
                        borderWidth: 1,
                        borderRadius: 7
                    }}
                    onPress={() =>  this.props.navigation.navigate('ESCAPE RUN DEPART',
                    {
                        banniere: this.state.banniere,
                        scenario: this.state.scenario,
                    })}
                >
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Prêt à jouer</Text>
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
})