import {
    Text,
    StyleSheet,
    View,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
    Modal,
    Pressable,
    RefreshControl,
  } from "react-native";
  import React, { Component } from "react";
  
  export default class ExercicesNiveau1 extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        data: [],
        isLoading: true,
        modalVisible: false,
      };
    }
  
    setModalVisible = (visible) => {
      this.setState({ modalVisible: visible });
    };
  
    async getExerciceScenario() {
      try {
        const response = await fetch(
          ""
        );
        const json = await response.json();
        this.setState({ data: json.SCENARIO });
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ isLoading: false });
      }
    }
  
    componentDidMount() {
      this.getExerciceScenario();
    }
  
    render() {
      const { data, isLoading, modalVisible } = this.state;
  
      return (
        <View style={{ height: `95%`, backgroundColor: "white" }}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <>
                  <View style={styles.imageContainer}>
                    <Text style={{ marginTop: 10, fontSize: 18 }}>
                      {item.NOM_FR} X {item.VALEUR} {item.CONDITION}
                    </Text>
  
                    {/* DEBUT MODAL */}
  
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
                            <Text style={styles.modalText}>{item.DESC_FR}</Text>
                            <Pressable
                              style={[styles.button, styles.buttonClose]}
                              onPress={() => this.setModalVisible(!modalVisible)}
                            >
                              <Text style={styles.textStyle}>COMPRIS</Text>
                            </Pressable>
                          </View>
                        </View>
                      </Modal>
                      <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => this.setModalVisible(true)}
                      >
                        <Text style={styles.textStyle}>DESCRIPTION</Text>
                      </Pressable>
                    </View>
  
                    {/* FIN MODAL */}
  
                    <TouchableOpacity>
                      <Image
                        source={{ uri: item.GIF }}
                        style={styles.image}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
  
                  {/* Ceci est le style du texte qui se trouvait en dessous du gif */}
                  {/* <View style={styles.textContainer}>
                      <Text style={styles.text}>
                          X {item.VALEUR} {item.CONDITION}
                      </Text>                                       
                  </View> */}
  
                  <View
                    style={{
                      borderBottomColor: "black",
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      marginTop: 10,
                    }}
                  ></View>
                </>
              )}
            />
          )}
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    textContainer: {
      marginTop: 0,
      alignItems: "center",
      justifyContent: "center",
    },
  
    image: {
      height: 180,
      width: 300,
      marginTop: 10,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: "#ccc",
    },
  
    // text:{
    //     fontWeight: 'bold',
    //     fontSize: 15,
    //     marginTop: 5,
    // },
  
    imageContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
  
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
      padding: 35,
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
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: "grey",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
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
  });
  