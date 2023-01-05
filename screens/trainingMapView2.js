import * as React from 'react';
import MapView, { Circle, Marker, Polyline } from 'react-native-maps';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as turf from '@turf/turf';
import TimerTraining from '../components/timerTraining';
import { useNavigation } from '@react-navigation/native';




// je passe props en parametre afin de recuperer le useNavigation dans l'enfant qui est une class component
export default function TrainingMapView2(props) {
    const map = React.useRef(null);

    const [positions, setPositions] = React.useState([]);
    const [distance, setDistance] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [icone, setIcone] = React.useState(false);
    const [image, setImage] = React.useState(null);

    const [totalRunInMeters, setTotalRunInMeters] = React.useState(0);
    const [elevationGain, setElevationGain] = React.useState(0);

    // const navigate = useNavigation();
    // console.log("MAP", map)


    const [mapRegion, setMapRegion] = React.useState({
        latitude: 46.227638,
        longitude: 2.213749,
        latitudeDelta: 15,
        longitudeDelta: 15,
    });


    const userLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location denied');
        }
        let location = await Location.getCurrentPositionAsync({ enableHightAccuracy: true })
        setMapRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.002922,
            longitudeDelta: 0.002421,
        })
        // console.log(location.coords.latitude, location.coords.longitude);
        setIcone(true);
    }


    // le useEffect a le meme effet que le componentWillUpdate mais dans une fonction component
    // React.useEffect(() => {
    // userLocation();

    // }, []);

    const onPositionChange = (position) => {
        // console.log("ON POSITION CHANGE", position)
        // console.log("MAP", map)
        if (map.current == null) {
            return
        }
        const duration = positions[0] ? Math.round(position.timestamp / 1000) - Math.round(positions[0].timestamp / 1000) : 0;

        const newDistance = positions[0] ? distanceBetween(positions[positions.length - 1], position) : 0;

        // calcul de l'allure ??? (moyenne de la vitesse)
        // const pace = positions[0] ? paceBetween(distance, positions[positions.length - 1], position) : 0;

        positions.push(position)
        // console.log("POSITIONS", positions)
        setPositions(positions);
        setDistance(newDistance + distance);
        setDuration(duration);
        calculDistance();
        // console.log("DISTANCE", distance);
        // console.log("DURATION", duration);
    }


    const watcher = async () => {
        const options = { enableHighAccuracy: true, timeInterval: 1000, distanceInterval: 1 }
        await Location.watchPositionAsync(options, onPositionChange)
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
            latitudeDelta: 0.2922,
            longitudeDelta: 0.2421,
        })
        // console.log("MAP REGION", mapRegion)
        // 'takeSnapshot' takes a config object with the
        // following options
        // console.log("MAP", map)
        const snapshot = map.current.takeSnapshot({
            width: 300,      // optional, when omitted the view-width is used
            height: 300,     // optional, when omitted the view-height is used
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

    //CALCUL DISTANCE et DENIVELE...............................
    const position = {}
    const calculDistance = async () => {

        const points = [];
        positions.forEach(position => {
            points.push(position);
        });

        if (points.length > 1) {
            let totalDistance = 0;

            let totalElevationGain = 0;

            for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];
                const distance = turf.distance([p1.coords.longitude, p1.coords.latitude], [p2.coords.longitude, p2.coords.latitude], { units: 'meters' });
                if (!isNaN(distance)) {
                    totalDistance += distance;
                }
                // console.log("P1",p1)
                // console.log("P2",p2.coords.longitude)
                // console.log("TOTAL DISTANCE", totalDistance);
                setTotalRunInMeters(totalDistance.toFixed(2))

                // Calcul de la différence de hauteur entre les deux points
                const elevationDifference = p2.coords.altitude - p1.coords.altitude;
                if (!isNaN(elevationDifference)) {
                    totalElevationGain += elevationDifference;
                }
                //   console.log("P1",p1.coords.altitude)
                //   console.log("P2",p2.coords.altitude)
                //   console.log("TOTAL ELEVATION",totalElevationGain)

                setElevationGain(totalElevationGain);
            }
        }
    }
    //...............................CALCUL DISTANCE et DENIVELE

    //TASK MANAGER...................................................................
    // TaskManager.defineTask('LOCATION_TASK', ({ data, error }) => {
    //     if (error) {
    //       console.error(error);
    //       return;
    //     }

    //     if (data) {
    //       const { locations } = data;
    //       console.log(locations);
    //       // Enregistrez les positions de l'utilisateur dans votre base de données ou effectuez une autre action ici
    //     }
    //   });

    //   const startLocationTracking = async () => {
    //     await Location.startLocationUpdatesAsync('LOCATION_TASK', {
    //       accuracy: Location.Accuracy.Balanced,
    //       timeInterval: 1000,
    //       distanceInterval: 0
    //     });
    //   };

    //   // Demandez la permission de l'utilisateur pour accéder à sa localisation en arrière-plan et démarrez le suivi de la localisation lorsque la permission est accordée
    //   const requestLocationPermission = async () => {
    //     const { status } = await Location.requestBackgroundPermissionsAsync();
    //     if (status === 'granted') {
    //       startLocationTracking();
    //     }
    //   };
    //...................................................................TASK MANAGER


    //VITESSE MOYENNE.................................................
    // Calcul de la vitesse moyenne en km/h
    function getAverageSpeed(distance, time) {
        // Conversion de la distance en km et du temps en heures
        const distanceInKm = turf.length(distance, { units: 'kilometers' });
        const timeInHours = time / 3600;
        return distanceInKm / timeInHours;
    }

    // Exemple d'utilisation
    const line = turf.lineString([[0, 0], [1, 1]]);
    const time = 3600; // 1 heure en secondes
    // console.log(getAverageSpeed(line, time)); // Affiche "1.4142135623730951" (vitesse moyenne de 1 km en 35 minutes)
    //.................................................VITESSE MOYENNE

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
    // console.log(getElevationGain(line2, dist)); // Affiche "10" (dénivelé de 10 mètres sur 1 km)
    //.......................................................DENIVELE POSITIF

    return (

        <View style={styles.container}>

            {/* <Image
                source={{ uri: image }}
                style={{ height: 80, width: 80 }}
            /> */}

            <MapView style={styles.map}
                region={mapRegion}
                ref={map}

                showsUserLocation={true}
                followsUserLocation={true}
                userLocationUpdateInterval={5000}
            >

                {/* {icone === true ?
                    <Marker
                        coordinate={mapRegion} title='MOI'
                    // pinColor='#2196F3'
                    // draggable={true}
                    >
                        <Image
                            source={require("../assets/runImage.jpeg")}
                            style={{ height: 35, width: 35, borderRadius: 50 }}
                        />
                    </Marker>
                    : ""} */}


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
                        <Text>Distance</Text>
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
                <TimerTraining user={userLocation} snapshot={takeSnapshot} navigation={props.navigation} image={image} calculDistance={calculDistance} position={position} distance={totalRunInMeters} watcher={watcher} />
                {/* <Chatgpt /> */}
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