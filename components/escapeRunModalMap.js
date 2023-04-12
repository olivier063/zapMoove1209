import * as React from 'react';
import MapView, { Circle } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import mapService from '../services/mapService';


const LOCATION_TASK_NAME = 'background_location_task';

// je passe props en parametre afin de recuperer le useNavigation dans l'enfant qui est une class component
export default function EscapeRunModalMap(props) {
    console.log('PROPS MODAL', props)
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
            const response = await fetch(props.prop);
            const json = await response.json();
            console.log("JSON",json)

            //ici je set en passand par les props de la modale
            setLatitude(parseFloat(props.destination_latitude));
            setLongitude(parseFloat(props.destination_longitude));

            //ici je ne recupere que le currentIndex en props et je fetch pour recup le rayonDetection
            setRayon(parseFloat(json.SCENARIO[props.currentIndex].RAYON_DETECTION))
            console.log("RAYON",rayon)
            
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
        width: 330,
        height: '100%',
    },
});