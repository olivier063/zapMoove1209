import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList, ActivityIndicator} from 'react-native'
import React, { Component } from 'react'

export default class CompetitionChoixCourse extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          data: [],
          isLoading: true
        };
      }
    
      async getCoursesCompetitions() {
        try {
          const response = await fetch('https://www.zapmoove.fr/ext/zapmoove/listeChallenge.php');
          const json = await response.json();
          this.setState({ data: json });
        } catch (error) {
          console.log(error);
        } finally {
          this.setState({ isLoading: false });
        }
      }
    
      componentDidMount() {
        this.getCoursesCompetitions();
      }

  render() {
    const { data, isLoading } = this.state;
    return (

        //  le heigth 90% a resolu le Pb de scroll to bottom

       <View style={{ height: `90%` }}> 

        <View  style={styles.textContainer2}>
            <TouchableOpacity onPress={ () => this.props.navigation.navigate('MAP VIEW')}>
                <Text style={{marginLeft: 10}}>ENTRAINEMENT</Text>
                <Text style={{marginLeft: 10}}>Course à pied, marche, vélo</Text>
            </TouchableOpacity>
        </View>
            
            {isLoading ? <ActivityIndicator/> : (
                <FlatList
                
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                    
                  
            <>
        
                <View style={styles.imageContainer}>
                    <TouchableOpacity>
                        <Image
                            source={{uri: item.BANNIERE}} 
                            style={styles.image}
                            resizeMode= 'contain' 
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

  image:{
      height: 180,
      width: 300,
      marginTop: 10,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: '#ccc',
  },

  text:{
      fontWeight: 'bold',
      fontSize: 18,
  },

  imageContainer:{
      justifyContent: 'center',
      alignItems: 'center',
  },

  textContainer2: {
    margin: 10,
    borderWidth: 0.5,
    borderColor:'black',
    backgroundColor: 'white',
    borderRadius: 7,

}

  

 
});