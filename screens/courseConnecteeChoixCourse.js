import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native'
import React, { Component } from 'react'
import StorageService from '../services/storageService';

export default class CourseConnecteeChoixCourse extends Component {

  constructor(props) {
    super(props);
    // console.log("PROPS CHOIX COURSE", this.props)
    this.state = {
      data: [],
      isLoading: true,
      id_user: null,

    };
    // console.log("STATE",this.state)
  }

  async getStorage() {
    try {
      const loginState = await StorageService.load({ key: 'loginState' });
      console.log("LOGIN STATE in COURSE CONNECTEES", loginState)
      this.setState({
        id_user: loginState["ID_USER"], // le "ID_USER en majuscule correspond au JSON"
      });
    } catch (error) {
      this.setState({
        id_user: "",
      });
    }
  }

  async getCoursesConnectees() {
    await this.getStorage()
    if (this.state.id_user != null)
      try {
        const response = await fetch(``);
        const json = await response.json();
        // console.log(typeof json)
        this.setState({ data: json });
        console.log("DATA CHOIX COURSE", this.state.data);

      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ isLoading: false });
      }
  }

  componentDidMount() {
    this.getCoursesConnectees();
    this.getStorage();
  }

  render() {
    const { data, isLoading } = this.state;
    const { navigate } = this.props.navigation;
    return (

      //  le heigth 90% a resolu le Pb de scroll to bottom

      <View style={{ height: "100%", backgroundColor: "white" }}>

        {isLoading ? <ActivityIndicator /> : (
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (

              <>

                <View style={styles.imageContainer}>
                  <TouchableOpacity
                  onPress={() => navigate("DETAIL COURSE",
                  {
                    numCourse: item.NUM_COURSE, 
                    numFacture: item.NUM_FACTURE,
                    course: item.COURSE, 
                    evenement: item.EVENEMENT, 
                    debut: item.MKTIME_DEBUT,
                    fin: item.MKTIME_FIN,
                  })}
                  >
                    <Image
                      source={{ uri: item.AFFICHE }}
                      style={styles.image}
                      resizeMode='contain'
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.text}>
                    {item.EVENEMENT},
                  </Text>
                  <Text style={styles.text}>
                    {item.COURSE},
                  </Text>
                </View>

              </>
            )}
          />
        )}

      </View>
    )
  }
}

const styles = StyleSheet.create({
  textContainer: {
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    height: 180,
    width: 300,
    marginTop: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#ccc',
  },

  text: {
    fontWeight: 'bold',
    fontSize: 18,
  },

  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },




});