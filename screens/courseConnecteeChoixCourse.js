import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList, ActivityIndicator } from 'react-native'
import React, { Component } from 'react'
import StorageService from '../services/storageService';

export default class CourseConnecteeChoixCourse extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      data: [],
      isLoading: true,
      id_user: null,
    };
    console.log(this.state)
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
        const response = await fetch(`https://www.zapsports.com/ext/app/mes_courses.htm?ID_USER=${this.state.id_user}`);
        const json = await response.json();
        this.setState({ data: json });
        console.log("DATA DANS GetCOURSES", this.state.data);
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
    return (

      //  le heigth 90% a resolu le Pb de scroll to bottom

      <View style={{ height: `90%`, backgroundColor: "white" }}>

        {isLoading ? <ActivityIndicator /> : (
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (

              <>

                <View style={styles.imageContainer}>
                  <TouchableOpacity>
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