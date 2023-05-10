import React, { Component } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import timerEscapeService from '../services/timerEscapeService';

export default class EscapeRunCountDownQuestion2 extends Component {
    constructor(props) {
        super(props);
        // console.log('PROPS COUNT DOWN 2', this.props)
        this.state = {
            modalVisible: false,
            timeRemaining: this.props.time,
            // timeRemaining: 5,
            bonneReponseTexte: '',
            
        };
    }


    componentDidMount() {
        this.interval = setInterval(this.getTimer, 1000);
    }

    componentWillUnmount() {
        this.setState({timeRemaining: this.props.time})
        clearInterval(this.interval);
    }

    getTimer = () => {
        if (this.state.timeRemaining > 0) {
            this.setState({
                timeRemaining: this.state.timeRemaining - 1,
            });
        } else {
            clearInterval(this.interval);

            //   this.props.nextQuestion();
            this.setModalVisible();
            this.setReponse();
            timerEscapeService.removeFromTimer(- this.props.time);
        }
    };
   

    setModalVisible = () => {
        this.setState({ modalVisible: true });
    };
    setModalNonVisible = () => {
        this.setState({ modalVisible: false });
        this.props.nextQuestion();
    };

    //affichage de la bonne reponse à la fin du chrono
    setReponse = () => {
        if (this.state.timeRemaining === 0) {
            // Le temps est écoulé, afficher la bonne réponse
            const bonneReponse = this.props.key_bonne_reponse;
            const reponseFr = this.props.reponseFr;
            if (reponseFr) {
                const reponses = reponseFr.split(";;");
                const bonneReponseTexte = reponses[bonneReponse];
                this.setState({ bonneReponseTexte: bonneReponseTexte })
            }
        }
    }
    

    render() {
        const { modalVisible } = this.state;

        const { timeRemaining } = this.state;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;

        return (
            <View>
                <View>
                    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                        {minutes.toString().padStart(2, '0')}:
                        {seconds.toString().padStart(2, '0')}
                    </Text>
                </View>





                {/* MODAL */}

                <View style={styles.centeredView}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}>

                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>

                                <Text>
                                    La bonne reponse etait: 
                                </Text>

                                <Text style={{fontSize: 22, fontWeight: 'bold'}}>
                                {this.state.bonneReponseTexte}
                                </Text>

                                <Text style={{marginTop: 20}}>
                                    Vous avez perdu {this.props.time} secondes !!
                                </Text>

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
                                                QUESTION SUIVANTE
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        </View>
                    </Modal>


                </View>

                {/* MODAL */}

            </View>


        );
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        alignItems: "center",
        marginTop: 300,
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
        height: 300,
        justifyContent: "center",
    },
    button: {
        borderRadius: 10,
        padding: 5,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: "#2196F3",
        width: 200,
        marginTop: 10,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },

});