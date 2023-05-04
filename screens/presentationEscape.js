import { ActivityIndicator, Button, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'
import WebView from 'react-native-webview';

export default class PresentationEscape extends Component {
    constructor(props) {
        super(props);
        // console.log('PROPS', this.props)
        this.state = {
            data: [],
            evenement: null,
            numEvent: this.props.route.params.numEvent,
            banniere: this.props.route.params.banniere,
            titleEvent: this.props.route.params.titleEvent,
            isLoading: true,

            scenario: this.props.route.params.scenario,
            depart: this.props.route.params.depart,
            infoFr: this.props.route.params.infoFr,
            rayon: this.props.route.params.rayon,
        };
    }


    async componentDidMount() {
        await this.getTilesPresentationEscape();
        await this.getTilesColor();
        // this.selectType();
    }



    async getTilesPresentationEscape() {
        try {
            const response = await fetch(
                "https://www.sports-events.org/ext/zapmoove/accueil_evt.php?NUM_EVT=" +
                this.state.numEvent
            )
            const json = await response.json()
            // console.log('JSON PRES ESCAPE', json)
            if (response !== null) {
                const array = Object.values(json.TILES);
                this.setState({ data: array });
                // console.log('DATA', this.state.data)

                this.sortTiles();
            } else {
                console.log('erreur IF getTiles')
            }
        } catch (error) {
            console.log(error);
        } finally {
            this.setState({ isLoading: false });
        }
    }



    async getTilesColor() {
        try {
            const response = await fetch(
                "https://www.sports-events.org/ext/zapmoove/menu_evt.php?NUM_EVT=" +
                this.state.numEvent
            )
            const json = await response.json()
            if (response !== null) {

                this.setState({ evenement: json.EVENEMENT });
                // console.log('EVENT', this.state.evenement)
                this.setConfig();

            } else {
                console.log('erreur IF')
            }
        } catch (error) {
            console.log(error);
        } finally {
            this.setState({ isLoading: false });
        }
    }


    // Ici on met toutes les methodes relatives au style
    setConfig() {
        this.firstColorTiles()
    }


    // TILES...........................................................
    //format
    horizontalSize(format) {
        if (format == 1) {
            return 300
        } else if (format == 2) {
            return 150
        }
        return 100
    }
    // (v) pour valeur
    sortTiles() {
        this.state.data.forEach((v) => {
            v["LARGEUR"] = this.horizontalSize(v["FORMAT"])
        })
        this.setState({ data: this.state.data })
        // console.log(this.state.data)
    }

    //couleur
    firstColorTiles() {
        this.state.data.forEach((v) => {
            // console.log(this["COULEUR_PRIMAIRE"])
            if (typeof this.state.evenement["COULEUR_PRIMAIRE"] !== undefined) {
                v["COLOR_ONE"] = (this.state.evenement["COULEUR_PRIMAIRE"])
            }
        })
        this.setState({ data: this.state.data })
        // console.log('DATA',this.state.data)
    }
    // FIN TILES...........................................................


    webOrEscape(type, url) {
        const types = this.state.data.map(item => item.TYPE);
        console.log('TYPE', type);

        switch (type) {
            case "WEB":
                if (url.endsWith('.pdf')) {
                    this.props.navigation.navigate("REGLEMENT", {
                        url: url
                    });
                } else {
                    this.props.navigation.navigate("LIEN WEB", {
                        url: url,
                    })
                }
               
                break;
            case "ESCAPE":
                this.props.navigation.navigate("EXPLICATION ESCAPE",
                    {
                        infoFr: this.state.infoFr,
                        banniere: this.state.banniere,
                        scenario: this.state.scenario,
                    })
                break;
        }
    }

    // if(url.indexOf('.pdf') !== -1) {
    //     // c'est un pdf tu télécharges
    //   }   else {
    //     // c'est un lien tu rediriges
    //   }



    render() {

        const { data, isLoading } = this.state;
        const { navigate } = this.props.navigation;

        return (
            <View style={{ backgroundColor: 'white', height: '100%' }}>
                {isLoading ? (
                    <ActivityIndicator />
                ) : (
                    <>
                        <Text style={{ textAlign: 'center', fontSize: 25, marginTop: 0 }}>{this.state.titleEvent} </Text>
                        <Image
                            source={{ uri: this.state.banniere }}
                            style={styles.banniere}
                        //  resizeMode="contain"  
                        />
                        <View>
                            <FlatList
                                data={data} //the array to render
                                columnWrapperStyle={{ flexWrap: 'wrap', flex: 1, marginTop: 0, justifyContent: 'center' }}
                                numColumns={3}
                                horizontal={false}
                                keyExtractor={(item, index) => index.toString()}  // Extract keys for each item in the array
                                renderItem={({ item }) => ( //each item from the array will be rendered here
                                    <TouchableOpacity style={{ width: item["LARGEUR"] }}
                                        onPress={() => this.webOrEscape(item["TYPE"], item['URL_FR'])}


                                    // onPress={() => this.webOrEscape(item["TYPE","URL_FR"])}
                                    // onPress={() => this.webOrEscape({type: item["TYPE"], url_fr: item["URL_FR"]})}


                                    >
                                        <Text style={{
                                            marginTop: 5,
                                            height: 50,
                                            margin: 5,
                                            borderColor: 'black',
                                            borderWidth: 1,
                                            borderRadius: 7,
                                            textAlign: 'center',
                                            paddingTop: 15, // je mets un padding car impossible de centrer le texte
                                            backgroundColor: item["COLOR_ONE"]
                                        }}>{item.TITRE_FR}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </>
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    banniere: {
        height: 210,
        width: "100%",
        marginTop: 0,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 7
    },
    tiles: {
        marginTop: 10,
        height: 50,
        margin: 5,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 7,
        textAlign: 'center',
        paddingTop: 15,  // je mets un padding pour l'alignement vertical car justifyContent: 'center' ne fonctionne pas
    },

})