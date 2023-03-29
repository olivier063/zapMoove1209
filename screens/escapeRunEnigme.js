import { Alert, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import EscapeRunModalMap from '../components/escapeRunModalMap';


export default class EscapeRunEnigme extends Component {
    constructor(props) {
        super(props);
        console.log('PROPS', this.props)
        this.state = {
            modalVisible: false,

            data: [],
            currentIndex: 0,


        };
    }

    componentDidMount() {
        this.getEscapeScenario();
    }
    // componentDidUpdate(){
    //     this.getEscapeScenario();

    // }


    setModalVisible = () => {
        this.setState({ modalVisible: true });
    };
    setModalNonVisible = () => {
        this.setState({ modalVisible: false });
    };


    stopJeu = () => {
        Alert.alert(
            "Attention",
            "Mettre fin au jeu ?",
            [
                {
                    text: "NON",
                    style: "cancel"
                },

                {
                    text: "OUI",
                    onPress: () => this.props.navigation.navigate('MENU PRINCIPAL')
                }
            ]
        )
    };

    nextPoint = () => {
        Alert.alert(
            "",
            "Passer à l'énigme suivante",
            [
                {
                    text: "NON",
                    style: "cancel"
                },

                {
                    text: "OUI",
                    onPress: () => this.nextQuestion()
                }
            ]
        )
    };

    getEscapeScenario = async () => {
        try {
            const response = await fetch(this.props.route.params.scenario);
            const json = await response.json();

            console.log(json.SCENARIO[this.state.currentIndex].CONDITION)
            this.setState({
                data: json.SCENARIO,

            })
            console.log(this.state.data.length)

        } catch (error) {
            console.log(error);
        }
    }

    nextQuestion = () => {
        this.setState({ currentIndex: this.state.currentIndex + 1 });
      }


    render() {
        const { modalVisible, data } = this.state;

        //je cree une props pour passer dans le composant de la modale
        const myProp = this.props.route.params.scenario

        return (
            <View style={{
                backgroundColor: '#86D2EF',
                height: '100%',
            }}>
                <Text style={{
                    textAlign: 'center',
                    marginTop: 10
                }}>Titre</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <View style={{
                        flex: 0.5,
                        alignItems: 'center',
                        marginLeft: 20,
                        borderWidth: 2,
                        borderColor: 'blue',
                        height: 50,
                        borderRadius: 7,
                    }}>
                        <Text>
                            progression
                        </Text>
                        <Text>
                        {this.state.currentIndex + 1}/{data.length}
                        </Text>
                    </View>

                    <View style={{
                        flex: 0.5,
                        alignItems: 'center',
                        marginRight: 20,
                        borderWidth: 2,
                        borderColor: 'blue',
                        height: 50,
                        justifyContent: 'center',
                        marginLeft: 90,
                        borderRadius: 7
                    }}>
                        <Text>
                            00:00:00
                        </Text>
                    </View>
                </View>

                <View style={{
                    backgroundColor: 'white',
                    height: 300,
                    marginTop: 20,
                    margin: 20,
                    borderRadius: 25,
                    alignItems: 'center'
                }}>
                    <Text style={{ marginTop: 10 }}>
                        ENIGME
                    </Text>

                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        // dans le renderItem on ajoute l'index pour pouvoir l'utiliser dans la ternaire et donc afficher uniquement l'exercice courant
                        renderItem={({ item, index }) => (
                            <>
                                {index === this.state.currentIndex ?
                                    <View>
                                        <View style={{
                                            marginTop: 10,
                                            borderWidth: 1,
                                            borderColor: 'green',
                                            borderRadius: 7,
                                            height: 50,
                                            width: '90%',
                                            justifyContent: 'center',
                                        }}>
                                            <Text style={{ margin: 5, textAlign: 'center' }}>
                                                {item.INDICE_FR}
                                            </Text>
                                        </View>

                                        <View style={{
                                            marginTop: 10,
                                            borderWidth: 1,
                                            borderColor: 'red',
                                            borderRadius: 7,
                                            height: 50,
                                            width: '30%',
                                            justifyContent: 'center',
                                        }}>
                                            <Text style={{ margin: 5, textAlign: 'center' }}>
                                                TIMER
                                            </Text>
                                        </View>

                                        <Text style={{ margin: 5, textAlign: 'center' }}>
                                            Ceci est une REPONSE pour l'utilisateur
                                        </Text>

                                        <Text style={{ margin: 5, textAlign: 'center' }}>
                                            Ceci est une REPONSE pour l'utilisateur
                                        </Text>

                                        <Text style={{ margin: 5, textAlign: 'center' }}>
                                            Ceci est une REPONSE pour l'utilisateur
                                        </Text>

                                        <TouchableOpacity style={{
                                            backgroundColor: "#FF6F00",
                                            height: 35,
                                            width: '80%',
                                            borderRadius: 7,
                                            marginTop: 10,
                                            justifyContent: 'center'
                                        }}
                                            onPress={() => this.nextPoint()} >
                                            <Text style={{ textAlign: 'center' }}>
                                                je suis arrivé au point(ce bouton apparait quand il s'agit d'une question 'geoloc')
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    : ""}

                                {/* <Text style={{
                        textAlign: 'center',
                        marginTop: 10
                    }}>
                        Nom de la ville
                    </Text> */}


                            </>
                        )}
                    />

                </View>

                <View>

                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "red",
                                height: 50,
                                width: 150,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: 'black',
                                borderWidth: 1,
                                borderRadius: 7,
                                flex: 1,
                                marginLeft: 20,
                            }}
                            onPress={() => this.stopJeu()}
                        >
                            <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: 'white'
                            }}>STOP JEU</Text>
                        </TouchableOpacity>

                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 50,
                            borderWidth: 2,
                            borderColor: 'blue',
                            marginLeft: 70,
                            marginRight: 20,
                            borderRadius: 7
                        }}>
                            <Text>
                                SCORE:
                            </Text>
                            <Text>
                                0
                            </Text>
                        </View>

                    </View>
                </View>





                {/* MODAL */}

                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}>

                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>



                                {/* on vient passer l'url scenario en props via le composant */}
                                <EscapeRunModalMap prop={myProp} />




                                <View style={{ flexDirection: "row" }}>
                                    <View
                                        style={{ flex: 1, alignItems: "center" }}>
                                        <TouchableOpacity
                                            style={[
                                                styles.button,
                                                styles.buttonClose,
                                            ]}
                                            onPress={() => this.setModalNonVisible()}>
                                            <Text style={styles.textStyle}>
                                                FERMER
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        </View>
                    </Modal>

                    <TouchableOpacity style={{ alignItems: 'center' }}
                        onPress={() => this.setModalVisible()}
                    >
                        <Image source={require("../assets/map.png")}
                            resizeMode="contain"
                            style={styles.image} />
                        <Text>où suis-je</Text>
                    </TouchableOpacity>

                </View>

                {/* MODAL */}




            </View>
        )
    }
}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 9,
    },
    modalView: {
        margin: 10,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 10,
        padding: 5,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: "#2196F3",
        width: 100,
        marginTop: 10
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    image: {
        height: 40,
        width: 50,
        borderRadius: 50,
    },

});
