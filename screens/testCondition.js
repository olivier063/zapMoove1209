import { Text, StyleSheet, View } from 'react-native'
import React, { Component } from 'react'
import ConditionalButton from '../components/conditionalButton'
import LoginButton from '../components/loginButton'
import LogoutButton from '../components/logoutButton'
import StorageService from '../services/storageService'

export default class TestCondition extends Component {
    constructor(props) {
        super(props)

        this.state = { 
            isLoggedIn: false
        };

        // permet de refresh le state pour que l'utilisateur se voit connecté
        this.props.navigation.addListener('focus', () => {
            this.getStorage();
          });
    }

    async getStorage() {     
        try {
            const loginState = await StorageService.load({ key: 'loginState' });
            console.log(loginState)
           this.setState({
               isLoggedIn: true
            });
           
        } catch (error) {
            console.log(error)
            this.setState({
                isLoggedIn: false
            });
        }
    }

    // Methode appelée après le rendu du composant
    componentDidMount() {
        console.log('componentDidMount')
        this.getStorage();
    }

    

    // ifLogoutClicked = () => {
    //     this.setState({ isLoggedIn: false });
    // }
    render() {
        
        return (
            <View>
                <ConditionalButton isLoggedIn={this.state.isLoggedIn} />
                {
                    (this.state.isLoggedIn) ? (
                        <LogoutButton  />
                    ) : (
                        
                        <LoginButton  />
                    )
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
 
})

