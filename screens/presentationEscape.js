import { ActivityIndicator, Button, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'

export default class PresentationEscape extends Component {
    constructor(props) {
        super(props);
        // console.log(this.props)
        this.state = {
            data: [],
            evenement: null,
            numEvent: this.props.route.params.numEvent,
            banniere: this.props.route.params.banniere,
            titleEvent: this.props.route.params.titleEvent,
            isLoading: true,

        };
    }



    async getTilesPresentationEscape() {
        try {
            const response = await fetch(
                "https://www.sports-events.org/ext/zapmoove/accueil_evt.php?NUM_EVT=" +
                this.state.numEvent
            )
            const json = await response.json()
            if (response !== null) {
                const array = Object.values(json.TILES);
                this.setState({ data: array });
                // console.log(array)
                // console.log(json.EVENEMENT)
                this.sortTiles()
                console.log("getTilesPresentation", this.state.data)
                // this.state.data[0]["LARGEUR"] = 125
            } else {
                console.log('erreur IF')
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
            // console.log(json)
            if (response !== null) {
                // const array = Object.values(json.EVENEMENT);
                //   this.setState({ data: array });
                // this.state.data.push(json.EVENEMENT)
                console.log("getTilesColor", this.state.data)
                this.setState({ evenement: json.EVENEMENT })
                this.setConfig()
                // console.log(json.EVENEMENT)
                console.log("getTilesColor2", this.state.data)
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
            console.log(this["COULEUR_PRIMAIRE"])
            if (typeof this.state.evenement["COULEUR_PRIMAIRE"] !== undefined) {
                v["COLOR_ONE"] = (this.state.evenement["COULEUR_PRIMAIRE"])
            }
        })
        this.setState({ data: this.state.data })
        // console.log(this.state.data)
    }
    // FIN TILES...........................................................

    async componentDidMount() {
        await this.getTilesPresentationEscape();
        await this.getTilesColor();
        // this.getTilesColorTest();
    }

    render() {

        const { data, isLoading, mData } = this.state;
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
                                    <TouchableOpacity style={{ width: item["LARGEUR"]}}>
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