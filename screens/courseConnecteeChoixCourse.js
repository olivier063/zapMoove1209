import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList, ActivityIndicator} from 'react-native'
import React, { Component } from 'react'

export default class CourseConnecteeChoixCourse extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          data: [],
          isLoading: true
        };
      }
    
      async getCoursesConnectees() {
        try {
          const response = await fetch("https://www.sports-events.org/ext/zapmoove/accueil.php?TYPE=VIRTUEL");
          const json = await response.json();
          this.setState({ data: json });
        } catch (error) {
          console.log(error);
        } finally {
          this.setState({ isLoading: false });
        }
      }
    
      componentDidMount() {
        this.getCoursesConnectees();
      }

  render() {
    const { data, isLoading } = this.state;
    return (

        //  le heigth 90% a resolu le Pb de scroll to bottom

       <View style={{ height: `90%`, backgroundColor:"white" }}> 
            
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
      marginTop: 20,
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

  

 
});