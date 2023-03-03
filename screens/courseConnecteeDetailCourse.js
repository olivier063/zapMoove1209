import { Text, View } from 'react-native'
import React, { Component } from 'react'
import StorageService from '../services/storageService';

export default class CourseConnecteeDetailCourse extends Component {
    constructor(props) {
        super(props);
      console.log("PROPS DETAIL COURSE",this.props)
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
        //   console.log("LOGIN STATE in COURSE CONNECTEES", loginState)
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
            const response = await fetch(`https://www.zapsports.com/ext/app/une_course.htm?ID_USER=${this.state.id_user}&NUM_COURSE=${this.props.route.params.numCourse}&NUM_FACTURE=${this.props.route.params.numFacture}`);
            const json = await response.json();
            this.setState({ data: json });

            console.log("DATA DETAIL COURSE", this.state.data);
    
            // this.state.data.map(item => {
            //   // console.log('ITEM', item.NUM_COURSE);
            //   this.setState({
            //     numCourse: item.NUM_COURSE,
            //     numFacture: item.NUM_FACTURE
            //   })
            // });
            // console.log(this.state.numCourse)
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
      <View>
        <Text>courseConnecteeDetailCourse</Text>
      </View>
    )
  }
}