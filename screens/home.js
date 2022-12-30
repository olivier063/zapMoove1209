import { Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native'
import React, { Component } from 'react'
import StorageService from '../services/storageService';

export default class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modalVisible: false,
            prenom: "",
            nom: "",
            homme: "",
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
            console.log("LOGIN STATE in HOME",loginState) 
            this.setState({
                prenom: loginState["PRENOM"], // le PRENOM et NOM majuscule correspondent au Json
                nom: loginState["NOM"],
                homme: loginState["HOMME"],
            });
        } catch (error) { 
            this.setState({
                prenom: "",
                nom: "",
                homme: "",
            });
        }
    }



    componentDidMount() {
        this.getStorage();
    }
    
    render() {
       

        return (
            <View style={{ backgroundColor: 'white', height: '100%' }}>
                <View style={styles.creerCompte}>

                    {(this.state.homme != null) ?
                   ( <Text style={styles.compte}>Bienvenu {this.state.prenom}</Text>) :
                   ( <Text style={styles.compte}>Bienvenue {this.state.prenom}</Text>)
                    }
    
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

