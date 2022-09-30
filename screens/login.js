

import {
    View,
    Text
} from "react-native";
import React, { Component } from "react";
import StorageService from "../services/storageService";
import ConditionalButton from "../components/conditionalButton";
import LogoutButton from "../components/logoutButton";
import LoginButton from "../components/loginButton";


export default class Login extends Component {
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
            // console.log(loginState)
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
        // console.log('componentDidMount')
        this.getStorage();
    }

   
   
   
    render() {

        return (
            <View>
                {
                    (this.state.isLoggedIn) ? (
                        <LogoutButton />
                    ) : (

                        <LoginButton />
                    )
                }
                <ConditionalButton isLoggedIn={this.state.isLoggedIn} />
            </View>
        )
    }
}



