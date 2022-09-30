import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StorageService from '../services/storageService';
import React, { useEffect, useState } from 'react';
import ModalPassword from './modalPassword';
import WebView from 'react-native-webview';



export default function ConditionalButton(props) {
    const navigation = useNavigation();
    console.log(props)

    // modifier le compte.................

    const [idUser, setIdUser] = useState('');

    const getStorage = async () => {
        try {
            const loginState = await StorageService.load({ key: 'loginState' });
            console.log(loginState)
            setIdUser(loginState["ID_USER"]);
            return loginState.idUser
        } catch (error) {
            setIdUser({
                idUser: ""
            });
        }
    }

    const logData = async () => {
        // const data = 
        await getStorage()
        console.log(idUser)
        if (idUser !== "") {
            navigation.navigate(`MODIFIER LE COMPTE`)
            console.log(idUser)
            // return (
            //     <WebView source={{uri: `https://www.zapsports.com/ext/app_page_web/su-creation-compte.htm?ID_USER=${idUser}`}} />
            // )
        } else {
            console.log('fonctionne pas')
        }
    }
    // le addListener permet d'ecouter le changement d'etat du composant sans refresh
    navigation.addListener('focus', () => {
        getStorage();
    });
    

    //..................................................

    if (props.isLoggedIn)
        return <View style={styles.buttonContainer}>
            <TouchableOpacity
                onPress={() => logData(idUser)}
                style={styles.textButton}
            >
                <Text style={{ color: "white", fontWeight: "bold" }}>Modifier le compte</Text>
            </TouchableOpacity>
        </View>;
    else
        return <View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("INSCRIPTION")}
                    style={styles.textButton}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Créer un compte</Text>
                </TouchableOpacity>
            </View>
            <ModalPassword />
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
    }
})