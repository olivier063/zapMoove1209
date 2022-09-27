import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import StorageService from '../services/storageService';
import { useNavigation } from '@react-navigation/native';



export default function LogoutButton() {
    
    const navigation = useNavigation();
    const logout = async (path) => {
        await StorageService.remove({key: 'loginState'});
        navigation.navigate(path)
    }

    return <View style={styles.buttonContainer}>
        <TouchableOpacity
            style={styles.textButton}
            onPress={() => logout("MENU PRINCIPAL")}
        >
            <Text style={{ color: "white", fontWeight: "bold" }}>Se déconnecter</Text>
        </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        // marginBottom: 100
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