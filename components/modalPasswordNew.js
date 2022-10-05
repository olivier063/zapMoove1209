import React, { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, TextInput, TouchableOpacity } from "react-native";
import validator from 'validator';

export default function ModalPasswordNew() {
 
    const [modalVisible, setModalVisible] = useState(false);
    const [mail, setMail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const forgotPassword = async () => {
        if (!validator.isEmail(mail)) {
            setErrorMessage('Email non valide')
            console.log(errorMessage)
            return;
        }
        try {
            const response = await fetch(
                `https://www.zapsports.com/ext/app/recover.htm?APP_EMAIL=${mail}`
            );
            const json = await response.json();
            if (!json || json == 'KO') {
                setErrorMessage('MDP ou EMAIL inexistants')
                console.log(errorMessage)
                console.log(json)
            } else {
                setErrorMessage('Un Email va vous être envoyé, merci de verifier vos Spams')
                console.log(json)
            }
        } catch (error) {
            setErrorMessage('Oups, un problème est survenu, réessayez plus tard!')
            console.error(errorMessage);
        }
    }


    // useEffect(()=>{
    //     forgotPassword()
    //   },[])

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>

                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Mot de passe perdu, contactez-nous !</Text>

                        <TextInput
                            style={{ height: 40, width: 200, margin: 12, borderWidth: 1, padding: 10, borderRadius: 7 }}
                            onChange={(e) => setMail(e.nativeEvent.text)}
                            value={mail}
                            placeholder="Entrez votre Mail"
                        // keyboardType="numeric"
                        />

                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: 'red', marginLeft: 10, marginRight: 10, textAlign: 'center' }}>{errorMessage}</Text>
                        </View>

                        <View style={{flexDirection: 'row'}}>
                            <View>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => forgotPassword()}
                            >
                                <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Valider</Text>
                            </TouchableOpacity>
                            </View> 

                            <View style={{marginLeft: 20}}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>FERMER</Text>
                            </TouchableOpacity>
                            </View>

                        </View>

                    </View>
                </View>
            </Modal>
            <TouchableOpacity
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.textStyle}>Mot de passe perdu ?</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: -50,
   
    },
    modalView: {
        marginTop: 330,
        backgroundColor: "white",
        borderRadius: 7,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: 300
    },
    button: {
        borderRadius: 7,
        padding: 10,
        // elevation: 2,
        marginTop: 10,
    },
    buttonOpen: {
        backgroundColor: "white",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
        marginBottom: 10
    },
    textStyle: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginTop: 10,
        marginBottom: 15,
        textAlign: "center"
    },
});