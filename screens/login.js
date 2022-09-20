import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
} from "react-native";
import React, { Component } from "react";
import StorageService from "../services/storageService";


export default class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modalVisible: false,
            mail: "",
            password: "",
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }



    handleInputChange = (name) => (event) => {
        this.setState({
            [name]: event.nativeEvent.text
        })
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    login = async (path) => {
        try {
            const response = await fetch(
                `https://www.zapsports.com/ext/app/compte.htm?APP_PSWD=${this.state.password}&APP_EMAIL=${this.state.mail}`

            );
            const json = await response.json();
            if (!json) {
                return (error)
            }
            
           await StorageService.save({
                key: 'loginState', // Note: Do not use underscore("_") in key!
                data: json,

            })
            // const loginState = await StorageService.load({key: 'loginState'});
            this.props.navigation.navigate(path)
        } catch (error) {
            console.log("test")
            console.error(error);
        }
    }



    // LOGOUT OLIVIER
    logout = async (path) => {
        StorageService.removeItem("loginState");
        this.props.navigation.navigate(path)
    }
    //.............


    render() {
        const { modalVisible } = this.state;
        // const { navigate } = this.props.navigation;


        return (
            <View style={{ backgroundColor: "white", height: "100%" }}>
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
                        value={this.state.mail}
                        onChange={this.handleInputChange('mail')}
                        placeholder="Entrez votre Mail"

                    />
                </View>

                <View>
                    <TextInput
                        style={styles.input}
                        value={this.state.password}
                        onChange={this.handleInputChange('password')}
                        secureTextEntry={true}
                        placeholder="Entrez votre Mot de Passe"
                    />
                </View>

                {/* MODAL */}
                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            this.setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>

                            <View style={styles.modalView}>
                                <Text>Un Mail vous sera envoyé</Text>
                                <TextInput
                                    style={{ height: 40, width: 200, margin: 12, borderWidth: 1, padding: 10, borderRadius: 7 }}
                                    // onChangeText={onChangeNumber}
                                    // value={number}
                                    placeholder="Entrez votre Mail"
                                // keyboardType="numeric"
                                />
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => this.setModalVisible(!modalVisible)}
                                >
                                    <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Valider</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <TouchableOpacity

                        onPress={() => this.setModalVisible(true)}
                    >
                        <Text style={styles.textStyle}>Mot de passe perdu ?</Text>
                    </TouchableOpacity>
                </View>
                {/* FIN MODAL */}

                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={() => this.login("MENU PRINCIPAL")}
                        style={styles.connectionButton}
                    >
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 17 }}>CONNEXION</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: "row" }}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.textButton}
                            onPress={() => this.logout("MENU PRINCIPAL")}
                        >
                            <Text style={{ color: "white", fontWeight: "bold" }}>Se déconnecter</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("INSCRIPTION")}
                            style={styles.textButton}
                        >
                            <Text style={{ color: "white", fontWeight: "bold" }}>Créer un compte</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>

        );
    }
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
    },
    image: {
        height: 100,
        width: 100,
        borderRadius: 50,
        marginTop: 10,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        borderRadius: 7,
        padding: 10,
    },
    connectionButton: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0E8CEF",
        height: 40,
        width: 200,
        borderRadius: 7,

    },




    //MODAL

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
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
        elevation: 2,
        marginTop: 10,
        width: 150
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
});
