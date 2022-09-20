import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

export default function LoginButton(props) {
    console.log(props)
         
   return(
    <View style={{ alignItems: "center" }}>
    <TouchableOpacity
        onPress={() => {props.clickFunc}}
        style={styles.connectionButton}
    >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 17 }}>CONNEXION</Text>
    </TouchableOpacity>
</View>
       );
}

const styles = StyleSheet.create({
    connectionButton: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0E8CEF",
        height: 40,
        width: 200,
        borderRadius: 7,

    },

})