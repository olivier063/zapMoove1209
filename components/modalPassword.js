import { Text, View, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'

export default class ModalPassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modalVisible: false,
            mail: ""
        }     
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }





  render() {
    const { modalVisible } = this.state;
    return (
      <View>
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
                                <Text style={{marginTop: 10}}>Mot de passe perdu, contactez-nous !</Text>
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
      </View>
    )
  }
}



const styles = StyleSheet.create({
centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50
},
modalView: {
    marginTop: 380,
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
    elevation: 2,
    marginTop: 10,
},
buttonOpen: {
    backgroundColor: "#F194FF",
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
    marginBottom: 15,
    textAlign: "center"
},
});
