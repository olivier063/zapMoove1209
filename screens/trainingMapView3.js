import * as React from 'react';
import MapView, { Circle, Marker, Polyline } from 'react-native-maps';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as turf from '@turf/turf';
import TimerTraining from '../components/timerTraining';
import { useNavigation } from '@react-navigation/native';
import * as TaskManager from 'expo-task-manager';
import mapService from '../services/mapService';


const LOCATION_TASK_NAME = 'background_location_task';

// je passe props en parametre afin de recuperer le useNavigation dans l'enfant qui est une class component
export default function TrainingMapView3(props) {
    const map = React.useRef(null);

    const [positions, setPositions] = React.useState([]);
    const [distance, setDistance] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [icone, setIcone] = React.useState(false);
    const [image, setImage] = React.useState(null);

    const [totalRunInMeters, setTotalRunInMeters] = React.useState(0); //distance
    const [elevationGain, setElevationGain] = React.useState(0); //denivele
    const [averageSpeed, setAverageSpeed] = React.useState(0); //vitesse moyenne
    const [paceSpeed, setPaceSpeed] = React.useState(0); //allure moyenne

    // const navigate = useNavigation();
    // console.log("MAP", map);

    const [mapRegion, setMapRegion] = React.useState({
        latitude: 46.227638,
        longitude: 2.213749,
        latitudeDelta: 15,
        longitudeDelta: 15,
    });


    const [status, setStatus] = React.useState(null)

    React.useEffect(() => {
        (async () => {
            // console.log("TOTO")
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setStatus('Permission to access location was denied');
                return;
            } else {
                const requestPermissions = async () => {
                    const { status } = await Location.requestBackgroundPermissionsAsync();
                    console.log("STATUS BACK", status)
                    if (status === 'granted') {
                        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                            accuracy: Location.Accuracy.BestForNavigation,
                            timeInterval: 1000,
                            distanceInterval: 5,
                        });
                    }
                };

                // TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
                //     if (error) {
                //         // Error occurred - check `error.message` for more details.
                //         return;
                //     }
                //     if (data) {
                //         const { locations } = data;
                //         // do something with the locations captured in the background
                //         //   console.log("LOCATION",locations)
                //         onPositionChange(locations[0])
                //     }
                // });
                requestPermissions()
                console.log('Access granted!!')
                setStatus(status)
                console.log('STATUS', status)
            }
        })();
    }, []);


    const backgroundLocation = () => {
        TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
            if (error) {
                // Error occurred - check `error.message` for more details.
                return;
            }
            if (data) {
                const { locations } = data;
                // do something with the locations captured in the background
                //   console.log("LOCATION",locations)
                onPositionChange(locations[0])
            }
        });
    }


    const userLocation = async () => {
        if (status === 'granted') {
            let location = await Location.getCurrentPositionAsync({ enableHightAccuracy: true })
            setMapRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.002922,
                longitudeDelta: 0.002421,
            })
            setIcone(true);
        }
    }


    const onPositionChange = (position) => {
        // console.log("ON POSITION CHANGE", position)
        // console.log("MAP", map)

        if (map.current == null) {
            return
        }
        const duration = positions[0] ? Math.round(position.timestamp / 1000) - Math.round(positions[0].timestamp / 1000) : 0;

        const newDistance = positions[0] ? distanceBetween(positions[positions.length - 1], position) : 0;

        positions.push(position)

        // console.log("POSITIONS", positions)
        setPositions(positions);
        setDistance(newDistance + distance);
        setDuration(duration);
        calculDistance();

        //LE SET MAP REGION PERMET DE CENTRER LA POSITION DE L'UTILISATEUR
        setMapRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.002922,
            longitudeDelta: 0.002421,
        });
        // console.log("DISTANCE", distance);
        // console.log("DURATION", duration);

    }
    const watcher = async () => {
        const options = { enableHighAccuracy: true, timeInterval: 1000, distanceInterval: 1 }
        // await Location.watchPositionAsync(options, onPositionChange)
    }

    const distanceBetween = (from, to) => {
        const options = { units: 'meters' };
        const origin = turf.point([from.coords.longitude, from.coords.latitude]);
        const destination = turf.point([to.coords.longitude, to.coords.latitude]);
        return turf.distance(origin, destination, options);
    };
    // console.log('POSITIONS', positions)

    //SNAPSHOT..........................................................
    const takeSnapshot = async () => {
        if (map.current == null) {
            return
        }
        //Permet de dezoom la map (ajouter un 0 apres les virgules pour zoomer )
        setMapRegion({
            latitude: mapRegion.latitude,
            longitude: mapRegion.longitude,
            latitudeDelta: mapRegion.latitudeDelta * 5,
            longitudeDelta: mapRegion.longitudeDelta * 2,
        })
        // console.log("MAP REGION", mapRegion)
        // 'takeSnapshot' takes a config object with the
        // following options
        // console.log("MAP", map)
        const snapshot = map.current.takeSnapshot({
            width: 300,      // optional, when omitted the view-width is used
            height: 150,     // optional, when omitted the view-height is used
            //   region: {..},    // iOS only, optional region to render
            format: 'png',   // image formats: 'png', 'jpg' (default: 'png')
            quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
            result: 'file'   // result types: 'file', 'base64' (default: 'file')
        });
        const uri = await snapshot;
        setImage(uri)
        return uri
    }
    //..........................................................SNAPSHOT

    //CALCUL DISTANCE, DENIVELE, VITESSE MOYENNE...............................
    const position = {}
    const calculDistance = async () => {

        //CHANGE const par var points
        var points = [];
        positions.forEach(position => {
            points.push(position);
        });

        if (points.length > 1) {
            let totalDistance = 0;

            let totalElevationGain = 0;

            for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];

                //CHANGE const par var distance
                var distance = turf.distance([p1.coords.longitude, p1.coords.latitude], [p2.coords.longitude, p2.coords.latitude], { units: 'meters' });
                if (!isNaN(distance)) {
                    totalDistance += distance;
                }
                //To FIXED permet d'afficher 2 chiffres après la virgule.
                setTotalRunInMeters(totalDistance.toFixed(2))

                //DENIVELE Calcul de la différence de hauteur entre les deux points 
                const elevationDifference = p2.coords.altitude - p1.coords.altitude;
                if (!isNaN(elevationDifference)) {
                    totalElevationGain += elevationDifference;
                }
                setElevationGain(totalElevationGain.toFixed(2));
                // console.log("ELEVATION", elevationGain)
            }

            //VITESSE MOYENNE
            let totalTime = 0;
            for (let i = 0; i < points.length - 1; i++) {
                //Calculer la différence de temps entre les deux points
                const timeDifference = new Date(points[i + 1].timestamp) - new Date(points[i].timestamp);
                if (!isNaN(timeDifference)) {
                    totalTime += timeDifference;
                }
                //Convertir le temps en secondes
                const timeInSeconds = totalTime / 1000;
                //Calculer la vitesse moyenne en m/s et on multipli par 3.6 pour avoir en km/h.
                const averageSpeed = totalDistance / timeInSeconds * 3.6;

                setAverageSpeed(averageSpeed.toFixed(2))
                // console.log("ALLURE MOYENNE",averageSpeed, ": km/heures");
                // console.log(duration)
            }

            //ALLURE
            const timeInMinutes = totalTime / 60000;
            const allure = timeInMinutes / (totalDistance / 1000); //on divise par 1000 pour avoir des metres
            setPaceSpeed(allure.toFixed(2))
            // console.log("ALLURE",allure,"minutes par km");

            //DENIVELE POSITIF.......................................................
            //   const turf = require('@turf/turf');

            // // Calcul du dénivelé sur une distance donnée (en mètres)
            // function getElevationGain(line, distance) {
            //   // Extraction de la sous-section de la ligne
            //   const lineSub = turf.lineSliceAlong(line, 0, distance, {units: 'meters'});

            //   // Trouver le point le plus haut et le plus bas sur la ligne
            //   const highestPoint = turf.pointOnLine(lineSub, {type: 'Feature', properties: {}}).geometry.coordinates;
            //   const lowestPoint = turf.pointOnLine(lineSub, {type: 'Feature', properties: {}}).geometry.coordinates;
            //   for (const coord of lineSub.geometry.coordinates) {
            //     if (coord[2] > highestPoint[2]) {
            //       highestPoint[2] = coord[2];
            //     }
            //     if (coord[2] < lowestPoint[2]) {
            //       lowestPoint[2] = coord[2];
            //     }
            //   }

            //   // Calcul du dénivelé en mètres
            //   return turf.pointDistance(highestPoint, lowestPoint, {units: 'meters'});
            // }

            // // Exemple d'utilisation
            // const line2 = turf.lineString([[0, 0, 10], [1, 1, 20], [2, 2, 30]]);
            // const dist = 1000; // 1 km en mètres
            // console.log(getElevationGain(line2, dist)); 
            // Affiche "10" (dénivelé de 10 mètres sur 1 km)
            //.......................................................DENIVELE POSITIF
        }
    }
    //...............................CALCUL DISTANCE, DENIVELE, VITESSE MOYENNE

    return (

        <View style={styles.container}>

            <MapView style={styles.map}
                region={mapRegion}
                ref={map}
                showsUserLocation={true}
                followsUserLocation={true}

            >
                {/* POLYLINE SE DESSINE LORS DES DEPLACEMENTS PAR UNE LIGNE ORANGE */}
                <Polyline
                    strokeColor="#e9ac47"
                    strokeWidth={6}
                    coordinates={positions.map(position => position.coords)}
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
                        <Text style={{ fontSize: 20 }}>{totalRunInMeters} m</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', marginTop: 0 }}>
                        <Text style={{ fontSize: 20 }}>{elevationGain}</Text>
                    </View>
                </View>

                {/* ON PASSE DANS LES PROPS DU COMPONENT POUR APPELER LA FONCTION DU PARENT VIA L'ENFANT (TimerTraining et takeSnapshot) Attention, on appelle la fonction dans l'enfant par le mot clef et non pas le nom de la fonction */}
                <TimerTraining user={userLocation} snapshot={takeSnapshot} navigation={props.navigation} image={image} calculDistance={calculDistance} position={position} distance={totalRunInMeters} watcher={watcher} averageSpeed={averageSpeed} paceSpeed={paceSpeed} elevationGain={elevationGain} backgroundLocation={backgroundLocation} />

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