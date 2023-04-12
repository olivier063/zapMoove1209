import * as React from 'react';
import MapView, { Circle } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import mapService from '../services/mapService';


const LOCATION_TASK_NAME = 'background_location_task';

// je passe props en parametre afin de recuperer le useNavigation dans l'enfant qui est une class component
export default function EscapeRunMapViewPosition(props) {
    // console.log('PROPS POSITION', props)
    // recentre sur la france
    const [mapRegion, setMapRegion] = React.useState({
        latitude: 46.227638,
        longitude: 2.213749,
        latitudeDelta: 15,
        longitudeDelta: 15,
    });
    const [latitude, setLatitude] = React.useState(0);
    const [longitude, setLongitude] = React.useState(0);
    const [rayon, setRayon] = React.useState(0);



    React.useEffect(() => {
        getEscapeScenario();
       

    }, []);



    // on recupere les scenarios pour avoir la longitude et latitude du point de depart et l'afficher dans la mapView
    getEscapeScenario = async () => {
        try {
            const response = await fetch(props.route.params.scenario);
            const json = await response.json();
            
            console.log(json)
            //la split methode permet de scinder les valeurs latitude et longitude du tableau qui ne sont qu'une seule chaine de caractere
            const myArray = [json.DEPART];
            const [latitudeStr, longitudeStr] = myArray[0].split(',');
            const latitude = parseFloat(latitudeStr);
            const longitude = parseFloat(longitudeStr);

            setLatitude(latitude);
            setLongitude(longitude);
            setRayon(parseFloat(json.RAYON));

        } catch (error) {
            console.log(error);
        }
    }






    return (

        <View style={styles.container}>

            {/* <ViewShot ref={ref => (viewShot = ref)} container={true}> */}
            <MapView style={styles.map}
                region={mapRegion}
                ref={mapService.map}
                showsUserLocation={true}
                followsUserLocation={true}

            >
                {/* POLYLINE SE DESSINE LORS DES DEPLACEMENTS PAR UNE LIGNE ORANGE */}
                {/* <Polyline
                    strokeColor="#e9ac47"
                    strokeWidth={6}
                    coordinates={mapService.mapStructure.positions.map(position => position.coords)}
                /> */}

                {/* ICI NOUS DEFINISSONS LE RAYON SUR UN POINT DEFINI DE LA MAP */}
                <Circle
                    center={{ latitude: latitude, longitude: longitude }}
                    radius={rayon}
                />
            </MapView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    map: {
        width: '100%',
        height: '100%',
    },
});