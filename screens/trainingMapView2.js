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


    // le useEffect a le meme effet que le componentwillmount mais dans une fonction component
    React.useEffect(() => {
        // userLocation();
        watcher();
    }, []);

    const onPositionChange = (position) => {
        // console.log("ON POSITION CHANGE", position)
        // console.log("MAP", map)
        if (map.current == null) {
            return
        }

        // calcul du tps de course
        // const duration = positions[0] ? position.timestamp - positions[0].timestamp : 0;

        const duration = positions[0] ? Math.round(position.timestamp / 1000) - Math.round(positions[0].timestamp / 1000) : 0;

        const newDistance = positions[0] ? distanceBetween(positions[positions.length - 1], position) : 0;

        // calcul de l'allure ??? (moyenne de la vitesse)
        // const pace = positions[0] ? paceBetween(distance, positions[positions.length - 1], position) : 0;

        positions.push(position)
        // console.log("POSITIONS", positions)
        setPositions(positions);
        setDistance(newDistance + distance);
        setDuration(duration);
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
    const takeSnapshot = () => {
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
        console.log("MAP REGION", mapRegion)
        // 'takeSnapshot' takes a config object with the
        // following options
        console.log("MAP", map)
        const snapshot = map.current.takeSnapshot({
            width: 300,      // optional, when omitted the view-width is used
            height: 300,     // optional, when omitted the view-height is used
            //   region: {..},    // iOS only, optional region to render
            format: 'png',   // image formats: 'png', 'jpg' (default: 'png')
            quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
            result: 'file'   // result types: 'file', 'base64' (default: 'file')
        });

        snapshot.then((uri) => {

            console.log("URI", uri)

            setImage(uri)
        });
    }
    //..........................................................SNAPSHOT



    return (

        <View style={styles.container}>

            <Image
                source={{ uri: image }}
                style={{ height: 150, width: 200 }}
            />

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
                        <Text style={{ fontSize: 20 }}>0.00</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', marginTop: 0 }}>
                        <Text style={{ fontSize: 20 }}>0.00</Text>
                    </View>
                </View>

                {/* ON PASSE DANS LES PROPS DU COMPONENT POUR APPELER LA FONCTION DU PARENT VIA L'ENFANT (TimerTraining et takeSnapshot) */}
                <TimerTraining user={userLocation} snapshot={takeSnapshot} navigation={props.navigation} image={setImage} />
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
        height: '35%',
        marginTop: 5,
    },
});