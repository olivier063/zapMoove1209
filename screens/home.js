import { Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native'
import React, { Component, useEffect } from 'react'
import StorageService from '../services/storageService';





export default class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modalVisible: false,
            prenom: "",
            nom: ""
        }
        
        this.props.navigation.addListener('focus', () => {
            this.getStorage();
          });
    
          console.log(props)
    }



    async getStorage() {
        try {
            const loginState = await StorageService.load({ key: 'loginState' });
            console.log(loginState)
            this.setState({
                prenom: loginState["PRENOM"],
                nom: loginState["NOM"]
            });
        } catch (error) {
            this.setState({
                prenom: "",
                nom: "",
            });
        }
    }

    componentDidMount() {
        console.log("TEST")
        this.getStorage();
    }

    render() {
       

        return (
            <View style={{ backgroundColor: 'white', height: '100%' }}>
                <View style={styles.creerCompte}>
                    <Text style={styles.compte}>Bienvenu.e {this.state.prenom} {this.state.nom}</Text>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("TEST CONDITION")}
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
        width: 300,
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

