import { Alert, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import EscapeRunModalMap from '../components/escapeRunModalMap';
import EscapeRunCountDownQuestion from '../components/escapeRunCountDownQuestion';
import EscapeRunCountDownGeneral from '../components/escapeRunCountDownGeneral';
import EscapeRunCountDownQuestion2 from '../components/escapeRunCountDownQuestion2';
import taskManagerService from '../services/taskManagerService';
import timerEscapeService from '../services/timerEscapeService';

const GEOFENCING_TASK_NAME = 'myGeofencingTask'; 

export default class EscapeRunEnigme extends Component {
    constructor(props) {
        super(props);
        // console.log('PROPS', this.props)
        this.state = {
            modalVisible: false,

            modalVisibleReponseCorrect: false,
            modalVisibleReponseFalse: false,
            bonneReponseTexte: '',
            timeRemaining: 0,

            data: [],
            titre: '',
            currentIndex: 0,
            condition: '',
            reponseFr: '',
            reponses: [],
            temps_reponse: 0,
            effet_valeur: 0,
            effet_type: '',
            key_bonne_reponse: 0,

            destination_latitude: 0,
            destination_longitude: 0,
            rayon_detection: 0,
        };
    }

    componentDidMount() {
        this.getEscapeScenario();
    } 
    

    //GESTION MODAL..................................................................
    setModalVisible = () => {
        this.setState({ modalVisible: true });
    };
    setModalNonVisible = () => {
        this.setState({ modalVisible: false });
    };

    setModalVisibleReponseCorrect = () => {
        this.setState({ modalVisibleReponseCorrect: true });
    };
    setModalNonVisibleReponseCorrect = () => {
        this.setState({ modalVisibleReponseCorrect: false });
        this.nextQuestion();
    };

    setModalVisibleReponseFalse = () => {
        this.setState({ modalVisibleReponseFalse: true });
    };
    setModalNonVisibleReponseFalse = () => {
        this.setState({ modalVisibleReponseFalse: false });
        this.nextQuestion();
    };
    //..................................................................GESTION MODAL

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
                    onPress: () => {
                        taskManagerService.unregisterTaskRegion(GEOFENCING_TASK_NAME);
                        this.props.navigation.navigate('MENU PRINCIPAL');
                    }
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

    getCurrentScenario = async () => {
        const reponseFr = this.state.data[this.state.currentIndex].REPONSE_FR;
         console.log('DATA', this.state.data[this.state.currentIndex].TEMPS_REPONSE)
         console.log('INDEX', this.state.currentIndex)
        const reponses = reponseFr.split(";;");
        this.setState({
            condition: this.state.data[this.state.currentIndex].CONDITION,
            temps_reponse: this.state.data[this.state.currentIndex].TEMPS_REPONSE,
            effet_valeur: this.state.data[this.state.currentIndex].EFFET_VALEUR,

            //obligé d'ajouter un +1 au current index pour avoir l'effet type de la bonne question sinon j'avais un decalage
            effet_type: this.state.data[this.state.currentIndex + 1].EFFET_TYPE,
            key_bonne_reponse: this.state.data[this.state.currentIndex].KEY_BONNE_REPONSE,

            // ici je passe par les state de cette vue pour passer à ma modale ce qui suit mais je pouvais tres bien le faire dns la modale direct
            destination_latitude: this.state.data[this.state.currentIndex].DESTINATION_LATITUDE,
            destination_longitude: this.state.data[this.state.currentIndex].DESTINATION_LONGITUDE,
            reponseFr: reponseFr,
            reponses: reponses,
        })
        // console.log('REPONSE FR',this.state.reponseFr)
        // console.log('EFFET TYPE', this.state.effet_type)
        // console.log('TEMPS REPONSE', this.state.temps_reponse)
    }

    getEscapeScenario = async () => {
        try {
            const response = await fetch(this.props.route.params.scenario);
            const json = await response.json();
            // console.log('JSON ENIGME', json)
            this.setState({
                data: json.SCENARIO,
                timeRemaining: json.TEMPS_MAX,
            }, () => {
                this.getCurrentScenario();
            })
        } catch (error) {
            console.log('ERROR', error);
        }
    }


    //pour que le changement d'index charge les nouvelles reponses de la question, je relance la fonction getEscapeScenario
    nextQuestion = () => {
        const nextIndex = this.state.currentIndex + 1;
        this.setState({ currentIndex: nextIndex }, () => {
            this.getCurrentScenario();
        });
    }

    //MODAL QUI S'OUVRE AU CLIQUE DE LA REPONSE SELON BONNE OU MAUVAISE REPONSE.....................................................
    verifierReponse = (reponseUtilisateur) => {
        // Vérifier si la réponse de l'utilisateur est correcte
        const bonneReponse = this.state.key_bonne_reponse;
        // console.log(this.state.key_bonne_reponse)
        const reponseFr = this.state.reponseFr;
        // console.log(this.state.reponseFr)

        const timeRemaining = this.state.timeRemaining
        console.log('STATE REMAINING',this.state.timeRemaining)

        if (reponseFr) {
            const reponses = reponseFr.split(";;");
            const bonneReponseTexte = reponses[bonneReponse];
            // console.log(reponseUtilisateur)
            this.setState({ bonneReponseTexte: bonneReponseTexte })
            if (reponseUtilisateur === bonneReponseTexte) {
                this.setModalVisibleReponseCorrect();

               timerEscapeService.removeFromTimer(60);

            } else {
                this.setModalVisibleReponseFalse();

                timerEscapeService.removeFromTimer(-60);
                
            }
        }
    }
    //.....................................................MODAL QUI S'OUVRE AU CLIQUE DE LA REPONSE SELON BONNE OU MAUVAISE REPONSE

    //MIS A JOUR DU COUNT DOWN SELON BONNE OU MAUVAISE REPONSE................
    // handleUserAnswer = (reponseUtilisateur) => {
    //     const isAnswerCorrect = this.verifierReponse(reponseUtilisateur); 
    //     if (isAnswerCorrect) {
    //         this.escapeRunCountDownGeneral.updateTimeRemaining(true);
    //     } else {
    //         this.escapeRunCountDownGeneral.updateTimeRemaining(false);
    //     }
    // }


    // updateTimeRemaining = (isAnswerCorrect) => {
    //     const timeDiff = isAnswerCorrect ? 60 : -60;
    //     const newTimeRemaining = this.state.timeRemaining + timeDiff;
    //     this.setState({ timeRemaining: newTimeRemaining });
    //   }
    //................MIS A JOUR DU COUNT DOWN SELON BONNE OU MAUVAISE REPONSE

    render() {
        const { modalVisible, data, modalVisibleReponseCorrect, modalVisibleReponseFalse } = this.state;

        //je cree des props pour passer dans le composant de la modale
        const myProp = this.props.route.params.scenario;
        const destination_latitude = this.state.destination_latitude;
        const destination_longitude = this.state.destination_longitude;
        return (
            <View style={{
                backgroundColor: '#86D2EF',
                height: '100%',
            }}>
                <Text style={{
                    textAlign: 'center',
                    marginTop: 10,
                    fontSize: 20,
                    fontWeight: 'bold'
                }}>{this.state.titre}</Text>

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
                            PROGRESSION
                        </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
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


                        <EscapeRunCountDownGeneral
                            prop={myProp}
                            // updateTimeRemaining={this.updateTimeRemaining}
                            timeRemaining={this.state.timeRemaining}
                        />

                    </View>
                </View>

                <View style={{
                    backgroundColor: 'white',
                    height: 300,
                    marginTop: 10,
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
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{
                                            marginTop: 10,
                                            borderWidth: 1,
                                            borderColor: 'green',
                                            borderRadius: 7,
                                            height: 50,
                                            width: '100%',
                                            justifyContent: 'center',
                                        }}>
                                            <Text style={{ margin: 5, textAlign: 'center' }}>
                                                {item.INDICE_FR}
                                                {item.QUESTION_FR}
                                            </Text>
                                        </View>

                                        {(this.state.temps_reponse != undefined && this.state.temps_reponse != 0) ?
                                            <View style={{
                                                marginTop: 10,
                                                borderWidth: 1,
                                                borderColor: 'red',
                                                borderRadius: 7,
                                                height: 35,
                                                width: '100%',
                                                alignItems: 'center',
                                            }}>
                                                <EscapeRunCountDownQuestion
                                                    time={this.state.temps_reponse}
                                                    reponseFr={this.state.reponseFr}
                                                // nextQuestion={this.nextQuestion}
                                                />
                                            </View>
                                            : (this.state.effet_valeur != undefined) ?
                                                <View style={{
                                                    marginTop: 10,
                                                    borderWidth: 1,
                                                    borderColor: 'red',
                                                    borderRadius: 7,
                                                    height: 35,
                                                    width: '100%',
                                                    alignItems: 'center',
                                                }}>
                                                    <EscapeRunCountDownQuestion2
                                                        time={this.state.effet_valeur}
                                                        reponseFr={this.state.reponseFr}
                                                        key_bonne_reponse={this.state.key_bonne_reponse}
                                                        nextQuestion={this.nextQuestion}
                                                    />
                                                </View>
                                                : "toto"
                                        }

                                        {item.QUESTION_FR ?
                                            <View style={{ alignContent: 'center' }}>

                                                <TouchableOpacity style={{
                                                    marginTop: 10,
                                                    height: 30,
                                                    width: 300,
                                                    backgroundColor: "#FF6F00",
                                                    borderRadius: 7,
                                                }}
                                                    onPress={() => this.verifierReponse(this.state.reponses[0])}
                                                >
                                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>
                                                        {this.state.reponses[0]}
                                                    </Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={{
                                                    marginTop: 10,
                                                    height: 30,
                                                    width: 300,
                                                    backgroundColor: "#FF6F00",
                                                    borderRadius: 7,
                                                }}
                                                    onPress={() => this.verifierReponse(this.state.reponses[1])}
                                                >
                                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>
                                                        {this.state.reponses[1]}
                                                    </Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={{
                                                    marginTop: 10,
                                                    height: 30,
                                                    width: 300,
                                                    backgroundColor: "#FF6F00",
                                                    borderRadius: 7,
                                                }}
                                                    onPress={() => this.verifierReponse(this.state.reponses[2])}
                                                >
                                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>
                                                        {this.state.reponses[2]}
                                                    </Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={{
                                                    marginTop: 10,
                                                    height: 30,
                                                    width: 300,
                                                    backgroundColor: "#FF6F00",
                                                    borderRadius: 7,
                                                }}
                                                    onPress={() => this.verifierReponse(this.state.reponses[3])}
                                                >
                                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>
                                                        {this.state.reponses[3]}
                                                    </Text>
                                                </TouchableOpacity>

                                                {/* <TouchableOpacity style={{
                                                    marginTop: 10,
                                                    height: 30,
                                                    width: 300,
                                                    backgroundColor: "#FF6F00",
                                                    borderRadius: 7,
                                                }}>
                                                    <Text style={{ textAlign: 'center', marginTop: 5 }}>
                                                        {this.state.reponses[4]}
                                                    </Text>
                                                </TouchableOpacity> */}

                                                <TouchableOpacity style={{
                                                    backgroundColor: "#FF6F00",
                                                    height: 35,
                                                    width: '80%',
                                                    borderRadius: 7,
                                                    marginTop: 30,
                                                    justifyContent: 'center',
                                                }}
                                                    onPress={() => this.nextPoint()} >
                                                    <Text style={{ textAlign: 'center' }}>
                                                        NEXT pour les tests
                                                    </Text>
                                                </TouchableOpacity>

                                            </View>
                                            :
                                            <View>
                                                <TouchableOpacity style={{
                                                    backgroundColor: "#FF6F00",
                                                    height: 35,
                                                    width: '80%',
                                                    borderRadius: 7,
                                                    marginTop: 30,
                                                    justifyContent: 'center',
                                                }}
                                                    onPress={() => this.nextPoint()} >
                                                    <Text style={{ textAlign: 'center' }}>
                                                        je suis arrivé au point(ce bouton apparait quand il s'agit d'une question 'geoloc')
                                                    </Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={{ alignItems: 'center' }}
                                                    onPress={() => this.setModalVisible()}
                                                >
                                                    <Image source={require("../assets/map.png")}
                                                        resizeMode="contain"
                                                        style={styles.image} />
                                                    <Text>où suis-je</Text>
                                                </TouchableOpacity>
                                            </View>
                                        }
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
                                <EscapeRunModalMap
                                    prop={myProp}
                                    destination_latitude={destination_latitude}
                                    destination_longitude={destination_longitude}
                                    currentIndex={this.state.currentIndex}
                                />




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


                </View>

                {/* MODAL */}

                {/* MODAL II */}

                <View style={styles.centeredView2}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisibleReponseCorrect}>

                        <View style={styles.centeredView2}>
                            <View style={styles.modalView}>


                                <Text style={{ textAlign: 'center', fontSize: 30, fontWeight: 'bold' }}>
                                    BRAVO!!
                                </Text>
                                <Text style={{ textAlign: 'center', fontSize: 17 }}>
                                    La bonne reponse est bien :
                                </Text>

                                <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 20 }}>
                                    {this.state.bonneReponseTexte}
                                </Text>

                                <Text style={{ marginTop: 20, fontSize: 17 }}>
                                    Vous avez gagné {this.state.effet_valeur} secondes!!
                                </Text>




                                <View style={{ flexDirection: "row" }}>
                                    <View
                                        style={{ flex: 1, alignItems: "center" }}>
                                        <TouchableOpacity
                                            style={[
                                                styles.button,
                                                styles.buttonClose,
                                            ]}
                                            onPress={() => this.setModalNonVisibleReponseCorrect()}>
                                            <Text style={styles.textStyle}>
                                                QUESTION SUIVANTE
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        </View>
                    </Modal>


                </View>

                {/* MODAL II */}

                {/* MODAL III */}

                <View style={styles.centeredView2}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisibleReponseFalse}>

                        <View style={styles.centeredView2}>
                            <View style={styles.modalView}>


                                <Text style={{ fontSize: 30, textAlign: 'center', fontWeight: 'bold' }}>
                                    DOMMAGE!!
                                </Text>
                                <Text style={{ fontSize: 17, textAlign: 'center' }}>
                                    La bonne reponse etait:
                                </Text>

                                <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 20, fontWeight: 'bold' }}>
                                    {this.state.bonneReponseTexte}
                                </Text>

                                <Text style={{ marginTop: 20, fontSize: 17 }}>
                                    Vous avez perdu {this.state.effet_valeur} secondes!!
                                </Text>




                                <View style={{ flexDirection: "row" }}>
                                    <View
                                        style={{ flex: 1, alignItems: "center" }}>
                                        <TouchableOpacity
                                            style={[
                                                styles.button,
                                                styles.buttonClose,
                                            ]}
                                            onPress={() => this.setModalNonVisibleReponseFalse()}>
                                            <Text style={styles.textStyle}>
                                                QUESTION SUIVANTE
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        </View>
                    </Modal>


                </View>

                {/* MODAL III */}




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
        width: 200,
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
        marginTop: 20,
    },
    centeredView2: {
        flex: 1,
        alignItems: "center",
        marginTop: 300,
    },

});
