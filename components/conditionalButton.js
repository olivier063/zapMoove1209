import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

export default function ConditionalButton(props) {

console.log(props)
    if (props.isLoggedIn)
        return <View style={styles.buttonContainer}>
        <TouchableOpacity
            onPress={() => this.props.navigation.navigate("INSCRIPTION")}
            style={styles.textButton}
        >
            <Text style={{ color: "white", fontWeight: "bold" }}>Modifier un compte</Text>
        </TouchableOpacity>
        </View>;
    else
        return <View style={styles.buttonContainer}>
        <TouchableOpacity
            onPress={() => this.props.navigation.navigate("INSCRIPTION")}
            style={styles.textButton}
        >
            <Text style={{ color: "white", fontWeight: "bold" }}>Créer un compte</Text>
        </TouchableOpacity>
        </View>;
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        marginBottom: 100
    },
    textButton: {
        backgroundColor: "#0E8CEF",
        height: 20,
        width: 140,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 7,
    }

})