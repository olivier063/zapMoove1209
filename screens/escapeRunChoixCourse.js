import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList, ActivityIndicator } from 'react-native'
import React, { Component } from 'react'

export default class EscapeRunChoixCourse extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true,

    };
  }

  async getEscapeCourses() {
    try {
      const response = await fetch('https://www.zapmoove.fr/ext/zapmoove/listeEscape.php');
      const json = await response.json();
      this.setState({ data: json });

      console.log('DATA', this.state.data)

    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoading: false });
    }
  }



  componentDidMount() {
    this.getEscapeCourses();
  }

  render() {
    const { data, isLoading } = this.state;
    const { navigate } = this.props.navigation;
    return (

      //  le heigth 90% a resolu le Pb de scroll to bottom

      <View style={{ height: `100%`, backgroundColor: 'white' }}>

        {isLoading ? <ActivityIndicator /> : (
          <FlatList

            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (


              <>

                <View style={styles.imageContainer}>
                  <TouchableOpacity
                    onPress={() => navigate("PRESENTATION ESCAPE",
                      {
                        numEvent: item.NUM_EVT,
                        banniere: item.BANNIERE,
                        titleEvent: item.EVENEMENT,

                        scenario: item.SCENARIO,
                        depart: item.DEPART,
                        infoFr: item.INFO_FR,
                        rayon: item.RAYON,
                        type: item.TYPE,
                        
                      })}
                  >
                    <Image
                      source={{ uri: item.BANNIERE }}
                      style={styles.image}
                    // resizeMode= 'contain' 
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.text}>
                    {item.EVENEMENT},
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
    height: 200,
    width: 350,
    marginTop: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#ccc',
    borderWidth: 1,
    borderColor: 'black'
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