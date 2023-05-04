import { Text, View } from 'react-native'
import React, { Component } from 'react'
import WebView from 'react-native-webview'


export default class EscapeRunReglement extends Component {
    constructor(props) {
        super(props);
        // console.log('PROPS', this.props)
        this.state = {
            url: this.props.route.params.url,
        };
    }

    render() {

        return (

            <View>
                <WebView source={{ uri: this.state.url }} />
                <View style={{ justifyContent: 'center', height: '100%' }}>
                    <Text style={{
                        fontSize: 20,
                        textAlign: 'center',
                        fontWeight: 'bold',
                    }}>Le reglement a été téléchargé sur votre appareil
                    </Text>
                </View>
            </View>

        )
    }
}


