import * as React from 'react';
import MapView, { Circle, Marker, Polyline } from 'react-native-maps';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as turf from '@turf/turf';



const map = React.createRef();

export default function TrainingMapView2() {
    const [positions, setPositions] = React.useState([]);
    const [distance, setDistance] = React.useState(0);
    const [icone, setIcone] = React.useState(false);
    const [startButton, setStartButton] = React.useState(true);
    const [pauseButton, setPauseButton] = React.useState(true);

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
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421,
        })
        console.log(location.coords.latitude, location.coords.longitude);
        setIcone(true);
    }

    React.useEffect(() => {
        // userLocation();
        watcher();
    }, []);


    const onPositionChange = (position) => {
        console.log("ON POSITION CHANGE", position)
        // console.log("MAP CURRENT", map)
        if (map.current == null) {
            return
        }
        // console.log("MAP",map)
        // map.current.animateToRegion(position.coords, 1000);

        //calcul du tps de course
        // const duration = positions[0] ? position.timestamp - positions[0].timestamp : 0;

        const newDistance = positions[0] ? distanceBetween(positions[positions.length - 1], position) : 0;

        // calcul de l'allure ??? (moyenne de la vitesse)
        // const pace = positions[0] ? paceBetween(distance, positions[positions.length - 1], position) : 0;

        positions.push(position)
        setPositions(positions);
        setDistance(newDistance + distance);

        // setMapRegion({
        //     latitude: position.coords.latitude,
        //     longitude: position.coords.longitude,
        //     latitudeDelta: 0.00922,
        //     longitudeDelta: 0.00421,
        // })
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
    console.log('POSITIONS', positions)

    const startRun = () => {
        userLocation();
        setStartButton(false)
    }

    const pauseRun = () => {
        setPauseButton(false)
    }

    const endPauseRun = () => {
        setPauseButton(true)
    }

    const stopRun = () =>
        Alert.alert(
            "Attention",
            "Mettre fin à la run ?",
            [
                {
                    text: "NON",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OUI", onPress: () => setStartButton(true)}
            ]
        );

    return (

        <View style={styles.container}>

            <Text style={{ marginTop: 5 }}>TEMPS</Text>
            <Text style={{ fontSize: 40 }}>00:00:00</Text>

            <View style={{ flexDirection: 'row' }}>
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

            <MapView style={styles.map}
                region={mapRegion}
                ref={map}
            >

                {icone === true ?
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
                    : ""}
                <Polyline
                    strokeColor="#e9ac47"
                    strokeWidth={6}
                    coordinates={positions.map(position => position.coords)}
                />
                <Circle
                    center={{ latitude: 43.700000, longitude: 7.250000 }}
                    radius={100}
                />
            </MapView>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>

                {/* <TouchableOpacity
                    onPress={userLocation}
                >
                    <Text>Localisez moi</Text>
                </TouchableOpacity> */}

                {startButton === true ?
                    <TouchableOpacity
                        style={{
                            marginTop: 0,
                            backgroundColor: "#FF6F00",
                            height: 40,
                            width: 200,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: 'black',
                            borderWidth: 1,
                            borderRadius: 7
                        }}
                        onPress={startRun}
                    >
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Démarrer la run</Text>
                    </TouchableOpacity>
                    :
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{
                                marginTop: 0,
                                backgroundColor: "#FF6F00",
                                height: 40,
                                width: 150,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: 'black',
                                borderWidth: 1,
                                borderRadius: 7
                            }}
                            onPress={pauseRun}
                        >
                            {pauseButton === true ?
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Pause</Text>
                                : <Text style={{ fontSize: 20, fontWeight: 'bold' }}
                                    onPress={endPauseRun}>Reprendre</Text>
                            }
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                marginLeft: 10,
                                backgroundColor: "red",
                                height: 40,
                                width: 150,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: 'black',
                                borderWidth: 1,
                                borderRadius: 7
                            }}
                            onPress={stopRun}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Arrêter la run</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    map: {
        width: '100%',
        height: '60%',
        marginTop: 10,
        borderRadius: 7
    },
});