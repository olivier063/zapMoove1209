import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import StorageService from '../services/storageService';

export default class CourseConnecteeDetailEnvoiGpx extends Component {
    constructor(props) {
        super(props);
        // console.log("PROPS DETAIL ENVOI GPX", this.props)
        this.state = {
            data: [],
            isLoading: true,
            id_user: null,

            formattedDateStart: null,
            formattedTimeStart: null,

            formattedDateEnd: null,
            formattedTimeEnd: null,

            gpx: null,
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
                // console.log(json)

                //pourquoi pas directement le setState data: json???? 
                const array = [];
                const myValues = array.push(json);
                // console.log('ARRAY', array);
                this.setState({ data: array });
                // console.log("DATA DETAIL ENVOI GPX", this.state.data);

            } catch (error) {
                console.log(error);
            } finally {
                this.setState({ isLoading: false });
            }
    }

    componentDidMount() {
        this.getCoursesConnectees();
        this.getStorage();
        this.convertTimestampStart();
        this.convertTimestampEnd();
    }

    //Converti les timestamp du json.........................
    convertTimestampStart() {
        const timestamp = this.props.route.params.debut;
        const date = new Date(timestamp * 1000); // On multiplie le timestamp par 1000 pour le convertir en millisecondes
        const formattedDateStart = date.toLocaleDateString(); // Format de la date (ex: "31/12/2021")
        const formattedTimeStart = date.toLocaleTimeString(); // Format de l'heure (ex: "23:00:00")

        this.setState({
            formattedDateStart: formattedDateStart,
            formattedTimeStart: formattedTimeStart,
        })
    }

    convertTimestampEnd() {
        const timestamp = this.props.route.params.fin;
        const date = new Date(timestamp * 1000); // On multiplie le timestamp par 1000 pour le convertir en millisecondes
        const formattedDateEnd = date.toLocaleDateString(); // Format de la date (ex: "31/12/2021")
        const formattedTimeEnd = date.toLocaleTimeString(); // Format de l'heure (ex: "23:00:00")

        this.setState({
            formattedDateEnd: formattedDateEnd,
            formattedTimeEnd: formattedTimeEnd,
        })
    }
    //.........................Converti les timestamp du json


    //TRANSMISSION AU SERVEUR DES DONNEES GPX.........................
    sendGpx = async () => {
       const sending = await this.gpxToFile();
        try {
            const response = await fetch("https://www.zapsports.com/ext/app/gpx.htm", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/xml',
                },
                body:({
                    // ajoutez les données que vous souhaitez envoyer dans le corps de la requête
                    NUM_VIRTUEL: this.props.route.params.numCourse,
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

    gpxToFile = async () => {
        const formData = new FormData();
        formData.append('gpxFile', this.props.route.params.pathGpx);
        
        const shareGpx = await formData
        this.setState({ gpx: shareGpx})
        // console.log("GPX FORM DATA", this.state.gpx);
    }
    //.........................TRANSMISSION AU SERVEUR DES DONNEES GPX

    // uploadFile = (file) => {
    //     const formData = new FormData();
    //     formData.append('file', file, 'file.gpx');
    //     console.log(formData)
    //     fetch('https://example.com/upload', {
    //       method: 'POST',
    //       body: formData,
    //       headers: {
    //         'Content-Type': 'application/xml'
    //       }
    //     }).then(response => {
    //       // Traiter la réponse du serveur
    //       console.log(response)
    //     }).catch(error => {
    //       // Traiter les erreurs éventuelles
    //       console.log(error)
    //     });
    //   }

    



    render() {
        const { data, isLoading } = this.state;
        return (
            <View style={{ height: '100%', backgroundColor: "white" }}>

                {isLoading ? <ActivityIndicator /> : (

                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <>

                                <View style={{ backgroundColor: "#8CDA45", margin: 5, borderRadius: 7 }}>
                                    <Text style={{
                                        textAlign: 'center',
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        marginBottom: 15,
                                        marginTop: 15,
                                    }}
                                    >
                                        {this.props.route.params.course}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: "black",
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                        borderWidth: 1,
                                        marginLeft: 10,
                                        marginRight: 10,
                                    }}
                                >
                                </View>


                                <View style={{ marginTop: 10, marginLeft: 10 }}>
                                    <Text style={{
                                        textAlign: 'left',
                                        fontSize: 20,
                                    }}
                                    >
                                        {this.props.route.params.evenement}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: "black",
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                        marginLeft: 10,
                                        marginRight: 10,
                                        marginTop: 10
                                    }}
                                >
                                </View>


                                <View style={{ marginTop: 10, marginLeft: 10 }}>
                                    <Text style={{
                                        textAlign: 'left',
                                        fontSize: 20,
                                    }}
                                    >
                                        Début: {this.state.formattedDateStart} - {this.state.formattedTimeStart}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: "black",
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                        marginLeft: 10,
                                        marginRight: 10,
                                        marginTop: 10
                                    }}
                                >
                                </View>


                                <View style={{ marginTop: 10, marginLeft: 10 }}>
                                    <Text style={{
                                        textAlign: 'left',
                                        fontSize: 20,
                                    }}
                                    >
                                        Fin: {this.state.formattedDateEnd} - {this.state.formattedTimeEnd}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: "black",
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                        marginLeft: 10,
                                        marginRight: 10,
                                        marginTop: 10
                                    }}
                                >
                                </View>


                                <View style={{ marginTop: 10, marginLeft: 10 }}>
                                    <Text style={{
                                        textAlign: 'left',
                                        fontSize: 20,
                                    }}
                                    >
                                        Distance: {item.COURSE_DISTANCE} km
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: "black",
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                        marginLeft: 10,
                                        marginRight: 10,
                                        marginTop: 10
                                    }}
                                >
                                </View>


                                <View style={{ marginTop: 10, marginLeft: 10 }}>
                                    <Text style={{
                                        textAlign: 'left',
                                        fontSize: 20,
                                    }}
                                    >
                                        Restant à effectuer:
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: "black",
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                        marginLeft: 10,
                                        marginRight: 10,
                                        marginTop: 10
                                    }}
                                >
                                </View>


                                <View style={{ marginTop: 10, marginLeft: 10 }}>
                                    <Text style={{
                                        textAlign: 'left',
                                        fontSize: 20,
                                    }}
                                    >
                                        Dossard: {item.DOSSARD}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: "black",
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                        marginLeft: 10,
                                        marginRight: 10,
                                        marginTop: 10
                                    }}
                                >
                                </View>


                                <View style={{ marginTop: 10, marginLeft: 10 }}>
                                    <Text style={{
                                        textAlign: 'left',
                                        fontSize: 20,
                                    }}
                                    >
                                        Cumul possible: {item.CUMUL}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: "black",
                                        borderBottomWidth: StyleSheet.hairlineWidth,
                                        marginLeft: 10,
                                        marginRight: 10,
                                        marginTop: 10
                                    }}
                                >
                                </View>

                                <View style={{ alignItems: 'center' }}>
                                    <TouchableOpacity style={{
                                        marginTop: 10,
                                        backgroundColor: "#FF6F00",
                                        height: 50,
                                        width: 250,
                                        borderRadius: 30,
                                        justifyContent: 'center'
                                    }}
                                    onPress={() => this.sendGpx()}
                                    >
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 17 }}>
                                            Envoyer GPX
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    />

                )}
            </View>
        )
    }
}