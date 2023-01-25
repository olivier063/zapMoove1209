import { Text, View, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native'
import React, { Component } from 'react'
import StorageService from '../services/storageService';
import mapService from '../services/mapService';
import * as Location from 'expo-location';

export default class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modalVisible: false,
            prenom: "",
            nom: "",
        }
        // le addListener permet d'ecouter le changement d'etat du composant et affiche les nom prenom de l'utilisateur à sa connection
        this.props.navigation.addListener('focus', () => {
            this.getStorage();
        });
        //   console.log(props)
    }

    // permet de load les donnees utilisateur, ici le prenom et le nom de l'utilisateur
    async getStorage() {
        try {
            const loginState = await StorageService.load({ key: 'loginState' });
            console.log("LOGIN STATE in HOME", loginState)
            this.setState({
                prenom: loginState["PRENOM"], // le PRENOM et NOM majuscule correspondent au Json
                nom: loginState["NOM"],
            });
        } catch (error) {
            this.setState({
                prenom: "",
                nom: "",
            });
        }
    }


    componentDidMount() {
        this.getStorage();
    }

    async permission() {
        // let { status } = await mapService.askPermission();
        // if (status !== 'granted') {
        //     console.log('permissions refusees')
        // }  this.props.navigation.navigate("CHOISIR UN MODE")


        //    let { status } = await Location.requestForegroundPermissionsAsync();
        //         if (status !== 'granted') {
        //             console.log('Permission to access location denied');
        //         } this.props.navigation.navigate("CHOISIR UN MODE")

        let { status } = await Location.requestForegroundPermissionsAsync({
            ios: {
                scope: 'whenInUse',
            },
            android: {
                context: 'whenInUse',
            },
        });
        if (status !== 'granted') {
            console.log("Permission to access location was denied");
        }
        let { status2 } = await Location.requestBackgroundPermissionsAsync({
            ios: {
                scope: 'always',
            },
            android: {
                context: 'background',
            },
        });
        if (status2 !== 'granted') {
            console.log("Permission to access location in the background was denied");
        }

        if (status === 'granted') {
            this.props.navigation.navigate("CHOISIR UN MODE")
        }
    }

    // componentDidUpdate() {
    //     (async () => {
    //         let { status } = await Location.requestForegroundPermissionsAsync();
    //         console.log("STATUS", status)
    //         if (status !== "granted") {
    //             Alert.alert("Permission to access foreground location was denied");
    //             return;
    //         }

    //         Alert.alert(
    //             "Attention",
    //             "Merci de 'TOUJOURS AUTORISER' pour démarrer un course",
    //             [
    //                 {
    //                     text: "OK",
    //                 }
    //             ]
    //         )

    //         let backPerm = await Location.requestBackgroundPermissionsAsync();
    //         console.log('BACK PERM', backPerm);
    //     })();
    // }



    render() {


        return (
            <View style={{ backgroundColor: 'white', height: '100%' }}>
                <View style={styles.creerCompte}>


                    <Text style={styles.compte}>Content de vous revoir {this.state.prenom} !</Text>



                </View>

                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>


                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("CHOIX COURSE CONNECTEE")}
                        >
                            <Image
                                source={require("../assets/courses-virtuelles.jpg")}
                                style={styles.image}
                            //   resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <Text style={styles.text}>Courses Connectées</Text>


                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("CHOISIR UN MODE")}
                        >
                            <Image
                                source={require("../assets/entrainements.jpg")}
                                style={styles.image}
                            //   resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <Text style={styles.text}>Exercices</Text>
                    </View>


                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("CHOIX ESCAPE RUN")}
                        >
                            <Image
                                source={require("../assets/escape-run.jpg")}
                                style={styles.image}
                            //   resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <Text style={styles.text}>Escape Run</Text>


                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("CHOIX COMPETITION")}
                        >
                            <Image
                                source={require("../assets/competition.jpg")}
                                style={styles.image}
                            //   resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <Text style={styles.text}>Compétitions</Text>
                    </View>



                </View>
            </View>
        )
    }
}





const styles = StyleSheet.create({
    image: {
        height: 100,
        width: 170,
        marginTop: 15,
        borderRadius: 7
    },
    compte: {
        fontWeight: "bold",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 7,
        fontSize: 18,
        width: '90%',
        textAlign: "center",
        marginTop: 5,
    },
    creerCompte: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16
    }
})

