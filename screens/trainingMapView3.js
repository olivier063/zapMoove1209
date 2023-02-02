import * as React from 'react';
import MapView, { Circle, Marker, Polyline } from 'react-native-maps';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import * as Location from 'expo-location';
import TimerTraining from '../components/timerTraining';
import mapService from '../services/mapService';



const LOCATION_TASK_NAME = 'background_location_task';

// je passe props en parametre afin de recuperer le useNavigation dans l'enfant qui est une class component
export default function TrainingMapView3(props) {
    

    const [mapRegion, setMapRegion] = React.useState({
        latitude: 46.227638,
        longitude: 2.213749,
        latitudeDelta: 15,
        longitudeDelta: 15,
    });


 


    React.useEffect(() => {
        (async () => {
            // console.log("TOTO")

              const {status} = await Location.requestForegroundPermissionsAsync();
              mapService.status = status
            //   console.log("MAP SERVICE",mapService.status)
            if (mapService.status !== 'granted') {
                mapService.status = 'Permission to access location was denied';
                return;
            } else {
                const requestPermissions = async () => {

                    const {status} = await Location.requestBackgroundPermissionsAsync();
                    mapService.status = status
                    console.log("STATUS BACK", mapService.status)
                    if (mapService.status === 'granted') {
                        // LE TIME INTERVAL DEFINI QUE LA MIS A JOUR DE LA POLYLINE SE FERA TOUTE LES 5 SECONDES
                        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                            accuracy: Location.Accuracy.BestForNavigation,
                            timeInterval: 5000,

                        });
                    }
                };

                requestPermissions()
                console.log('Access granted!!')
                console.log('STATUS', mapService.status)

                mapService.mapChange.subscribe(mapStructure => {
                    setMapRegion(mapService.mapRegion)
                });
            }
        })();
    }, []);

   


    return (

        <View style={styles.container}>

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

                {/* ON PASSE DANS LES PROPS DU COMPONENT POUR APPELER LA FONCTION DU PARENT VIA L'ENFANT (TimerTraining et takeSnapshot) Attention, on appelle la fonction dans l'enfant par le mot clef et non pas le nom de la fonction */}
                <TimerTraining  navigation={props.navigation} />

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