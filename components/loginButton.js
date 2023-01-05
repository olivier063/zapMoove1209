import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native'
import React, { useState } from 'react'
import validator from 'validator';
import StorageService from "../services/storageService";
import { useNavigation } from '@react-navigation/native';

export default function LoginButton() {

    const navigation = useNavigation();
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    // on rentre dans le local storage pour recuperer les donnees du loginState pour l'utiliser dans la fonction login plus bas
    const sendEmailValidationRequest = async (mail) => {
        try {
            const loginState = await StorageService.load({ key: 'loginState' });
            // console.log(loginState)
            return loginState.MAIL === mail
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    // Le name correpond au mail et password, event correpond au onChange de l'input

    //    const handleInputChange = (name) => (event) => {
    //         this.setState({
    //             [name]: event.nativeEvent.text
    //         })
    //     }

    // la fonction du dessus est remplacée par e) => setMail(e.nativeEvent.text) depuis l'input


    const login = async (path) => {
        // on verifie que le mail est valide selon regex grâce au validator installé via npm
        if (!validator.isEmail(mail)) {
            setErrorMessage('Email non valide')
            return;
        }

        // ici on verifie que le mail entrer dans l'input correpond a celui du local storage
        const isValidEmail = await sendEmailValidationRequest(mail)
        console.log(isValidEmail)
        if (isValidEmail) {
            navigation.navigate(path)
            return;
        }
        try {
            // ici la func login, fetch sur l'URL du Json et demande un password et un mail, ATTENTION: utiliser des cotes inversees
            const response = await fetch(
                `https://www.zapsports.com/ext/app/compte.htm?APP_PSWD=${password}&APP_EMAIL=${mail}`
            );
            // on attent une reponse en Json du fetch
            const json = await response.json();
            if (!json || json == 'KO') {
                setErrorMessage('MDP ou EMAIL inexistants')
                return;
            }
            // permet d'ajouter la ligne mail dans l'objet Json retourné par l'API
            json.MAIL = mail
            
            // on vient sauvegarder dans le local storage les donnees utilisateur
            await StorageService.save({
                key: 'loginState', // Note: Do not use underscore("_") in key!
                data: json,
            })
            // console.log(json)
            // const loginState = await StorageService.load({key: 'loginState'});
            navigation.navigate(path)

            //Toujours avoir un console log error pour afficher l'erreur
        } catch (error) {
            setErrorMessage('Oups, un problème est survenu')
            console.error(error);
        }
    }

    return (
        <View>
            <View style={{ alignItems: "center" }}>
                <Image
                    source={require("../assets/connection.png")}
                    resizeMode="contain"
                    style={styles.image}
                />
            </View>
            <View style={{ marginTop: 0 }}>
                <TextInput
                    style={styles.input}
                    value={mail}
                    onChange={(e) => setMail(e.nativeEvent.text)}
                    placeholder="Entrez votre Mail"

                />
            </View>

            <View>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.nativeEvent.text)}
                    secureTextEntry={true}
                    placeholder="Entrez votre Mot de Passe"
                />
            </View>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'red' }}>{errorMessage}</Text>
            </View>
            <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                    onPress={() => login("MENU PRINCIPAL")}
                    style={styles.connectionButton}
                >
                    <Text style={{ color: "white", fontWeight: "bold", fontSize: 17 }}>CONNEXION</Text>
                </TouchableOpacity>
            </View>

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
        marginTop: 30
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        borderRadius: 7,
        padding: 10,
    },
    image: {
        height: 100,
        width: 100,
        borderRadius: 50,
        marginTop: 30,
        marginBottom: 20
    },
})


