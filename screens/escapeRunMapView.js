import * as React from 'react';
import MapView, { Polyline } from 'react-native-maps';
import { StyleSheet, Text, View } from 'react-native';
import mapService from '../services/mapService';
import TimerTrainingEscapeRun from '../components/timerTrainingEscapeRun';




const LOCATION_TASK_NAME = 'background_location_task';

// je passe props en parametre afin de recuperer le useNavigation dans l'enfant qui est une class component
export default function EscapeRunMapView(props) {

    // recentre sur la france
    const [mapRegion, setMapRegion] = React.useState({
        latitude: 46.227638,
        longitude: 2.213749,
        latitudeDelta: 15,
        longitudeDelta: 15,
    });


    React.useEffect(() => {
        (async () => {
            //On reset toutes les donnees à la montee du comnposant pour que 
            // lorsque l'on rerentre dans mapView, il n'y ai plus de traces de la precedente Run
            // Le reset All etait avant dans le unregisterTask du taskManagerService
            mapService.resetAll();
            // console.log("TOTO")
            //recentre sur la france
            setMapRegion({
                latitude: 46.227638,
                longitude: 2.213749,
                latitudeDelta: 15,
                longitudeDelta: 15,
            })

            mapService.mapChange.subscribe(mapStructure => {
                // console.log("STRUCTURE", mapStructure)
                setMapRegion(mapService.mapRegion)
            });


        })();
    }, []);




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
                <Polyline
                    strokeColor="#e9ac47"
                    strokeWidth={6}
                    coordinates={mapService.mapStructure.positions.map(position => position.coords)}
                />
                {/* ICI NOUS DEFINISSONS LE RAYON SUR UN POINT DEFINI DE LA MAP */}
                {/* <Circle
                    center={{ latitude: 43.700000, longitude: 7.250000 }}
                    radius={100}
                /> */}
            </MapView>
            {/* </ViewShot> */}

            <View style={{ backgroundColor: "#92AFD7", height: '100%' }}>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text>Distance </Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text>Dénivelé</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, alignItems: 'center', marginTop: 0 }}>
                        <Text style={{ fontSize: 20 }}>{mapService.mapStructure.totalRunInMeters} m</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', marginTop: 0 }}>
                        <Text style={{ fontSize: 20 }}>{mapService.mapStructure.elevationGain}</Text>
                    </View>
                </View>

                {/* <TimerTrainingEscapeRun navigation={props.navigation} /> */}



            </View>
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
        height: '50%',
    },
});