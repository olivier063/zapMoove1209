import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from 'expo-location';


export default function TrainingMap() {

   

    async function verifyPermissions() {
        const [locationPermissionInformation, requestPermission] = useForegroundPermissions();

        if (locationPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission()
            return permissionResponse.granted;
        } if (locationPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert(
                "Permissions insufisantes!",
                "Vous devez accepter les conditions de localisation pour utiliser l'application."
            )
            return false;
        }
    }

    async function getLocationHandler() {
        const hasPermission = await verifyPermissions()
        if (!hasPermission) {
            return;
        }
        const location = await getCurrentPositionAsync()
        console.log(location)
    }


    function startTraining() {

    }


    return (
        <View>
            <View style={styles.mapPreview}></View>
            <View style={styles.actions}>
                <TouchableOpacity
                    style={{ flex: 1, height: 50, borderColor: 'black', borderWidth: 1, borderRadius: 7 }}
                    onPress={() => getLocationHandler()}
                >
                    <Text style={{ textAlign: 'center', marginTop: 14 }}>Localisez-moi</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flex: 1, height: 50, borderColor: 'black', borderWidth: 1, marginLeft: 5, borderRadius: 7 }}
                    onPress={() => startTraining()}
                >
                    <Text style={{ textAlign: 'center', marginTop: 14 }}>Demarrer l'entrainement !</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    mapPreview: {
        width: '100%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 7
    },

    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '20%',
        backgroundColor: 'white'
    },
})