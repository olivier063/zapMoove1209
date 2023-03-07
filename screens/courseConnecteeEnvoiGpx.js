import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList, ActivityIndicator, Alert } from 'react-native'
import React, { Component } from 'react'
import StorageService from '../services/storageService';

export default class CourseConnecteeEnvoiGpx extends Component {

  constructor(props) {
    super(props);
    // console.log("PROPS ENVOI GPX", this.props)
    // console.log("GPX", this.props.route.params.pathGpx)
    this.state = {
      data: [],
      isLoading: true,
      id_user: null,

      numCourse: null,
      numFacture: null,
      gpx: null,
    };
  }

  componentDidMount() {
    this.getCoursesConnectees();
    this.getStorage();
  }

  async getStorage() {
    try {
      const loginState = await StorageService.load({ key: 'loginState' });
      // console.log("LOGIN STATE in COURSE CONNECTEES", loginState)
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

  // (`https://www.zapsports.com/ext/app/une_course.htm?ID_USER=${this.state.id_user}&NUM_COURSE=323&NUM_FACTURE=FASPT202207261042606`) pour acceder a une course connectee
  // "https://www.zapsports.com/ext/app/gpx.htm"

  choisirCourse() {
    Alert.alert(
      'Attention',
      'Envoyer sur cette course?',
      [
        {
          text: 'Annuler',
          onPress: () => console.log('Annuler appuyé'),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => this.sendGpx(),
        },
      ]
    );
  }

  async sendGpx() {
    this.gpxToFile();
    try {
      const response = await fetch("https://www.zapsports.com/ext/app/gpx.htm", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // ajoutez les données que vous souhaitez envoyer dans le corps de la requête
          NUM_VIRTUEL: this.state.numCourse,
          ID_USER: this.state.id_user,
          GPX: this.state.gpx,
        })
      })
      if (response) {
        console.log("RESPONSE", response)
      } else {
        const json = await response.json()
        alert(json.message)
      }
    } catch (error) {
      console.log(error);
    }
  }

  async gpxToFile() {
    const formData = new FormData();
    formData.append('gpxFile', this.props.route.params.pathGpx);

    const gpxForm = await formData;

    this.setState({ gpx: gpxForm })
    console.log("GPX FORM DATA", this.state.gpx)
  }



  render() {
    const { data, isLoading } = this.state;
    return (

      <View style={{ height: `100%`, backgroundColor: "white" }}>

        {isLoading ? <ActivityIndicator /> : (
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (

              <>

                <View style={styles.imageContainer}>
                  <TouchableOpacity
                    onPress={() => this.choisirCourse()}
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