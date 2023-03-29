import * as Location from 'expo-location';
import { ReplaySubject } from 'rxjs';
import * as React from 'react';
import * as turf from '@turf/turf';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createGpx from 'gps-to-gpx'


class MapService {
    mapChange = new ReplaySubject();
    map = React.createRef(null);
    status = null;



    mapRegion = {
        latitude: 46.227638,
        longitude: 2.213749,
        latitudeDelta: 15,
        longitudeDelta: 15,
    };

    mapStructure = {
        positions: [],
        currentPosition: null,
        totalRunInMeters: 0,
        elevationGain: 0,
        image: null,
        averageSpeed: 0,
        city: null,

        pathGpx: null,
    }

    resetAll = () => {
        this.mapRegion = {
            latitude: 46.227638,
            longitude: 2.213749,
            latitudeDelta: 15,
            longitudeDelta: 15,
        };
        this.mapStructure = {
            positions: [],
            currentPosition: null,
            totalRunInMeters: 0,
            elevationGain: 0,
            image: null,
            averageSpeed: 0,
            city: null
        }
    }

    userLocationEscape = async () => {
        this.mapStructure = {
            positions: [],
            currentPosition: null,
            totalRunInMeters: 0,
            elevationGain: 0,
            image: null,
            averageSpeed: 0,
            city: null
        }
        // console.log("STRUCTURE", this.mapStructure)
        console.log("STATUS", this.status)
        if (this.status === 'granted') {
            let location = await Location.getCurrentPositionAsync({ enableHightAccuracy: true })
            this.mapRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.002922,
                longitudeDelta: 0.002421,
            }

        }
    }

    userLocation = async () => {
        this.mapStructure = {
            positions: [],
            currentPosition: null,
            totalRunInMeters: 0,
            elevationGain: 0,
            image: null,
            averageSpeed: 0,
            city: null
        }
        // console.log("STRUCTURE", this.mapStructure)
        console.log("STATUS", this.status)
        if (this.status === 'granted') {
            let location = await Location.getCurrentPositionAsync({ enableHightAccuracy: true })
            this.mapRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.002922,
                longitudeDelta: 0.002421,
            }

            //AFFICHE LA VILLE DANS LAQUELLE ON A COURU.........
            let geocode = await Location.reverseGeocodeAsync(location.coords);
            let city = geocode[0].city;
            try {
                await AsyncStorage.setItem('city', city);
                // console.log(city)
                this.mapStructure.city = city;
            } catch (error) {
                console.log(error);
            }
            //.........AFFICHE LA VILLE DANS LAQUELLE ON A COURU
        }
    }

    onPositionChange = async (currentPosition) => {
        // console.log("ON POSITION CHANGE", position)
        // console.log("MAP", this.map)
        if (this.map.current == null) {
            return
        }
        this.mapStructure.positions.push(currentPosition)
        this.mapStructure.currentPosition = currentPosition;

        //LE THIS MAP REGION PERMET DE CENTRER LA POSITION DE L'UTILISATEUR
        this.mapRegion = {
            latitude: currentPosition.coords.latitude,
            longitude: currentPosition.coords.longitude,
            latitudeDelta: 0.002922,
            longitudeDelta: 0.002421,
        };
        this.calculDistance();
        this.mapChange.next(this.mapStructure);
        // console.log("DISTANCE", distance);
        // console.log("DURATION", duration);

    }


    distanceBetween = (from, to) => {
        const options = { units: 'meters' };
        const origin = turf.point([from.coords.longitude, from.coords.latitude]);
        const destination = turf.point([to.coords.longitude, to.coords.latitude]);
        return turf.distance(origin, destination, options);
    };
    // console.log('POSITIONS', positions)

    //SNAPSHOT..........................................................
    takeSnapshot = async () => {
        if (this.map.current == null) {
            return
        }
        //Permet de dezoom la map (ajouter un 0 apres les virgules pour zoomer )
        this.mapRegion = {
            latitude: this.mapRegion.latitude,
            longitude: this.mapRegion.longitude,
            latitudeDelta: this.mapRegion.latitudeDelta,
            longitudeDelta: this.mapRegion.longitudeDelta,
        }
        // console.log("MAP REGION", mapRegion)
        // 'takeSnapshot' takes a config object with the
        // following options
        // console.log("MAP", map)
        const snapshot = this.map.current.takeSnapshot({
            // width: 300,      // optional, when omitted the view-width is used
            // height: 150,     // optional, when omitted the view-height is used
            //   region: {..},    // iOS only, optional region to render
            format: 'png',   // image formats: 'png', 'jpg' (default: 'png')
            quality: 1,    // image quality: 0..1 (only relevant for jpg, default: 1)
            result: 'file'   // result types: 'file', 'base64' (default: 'file')
        });
        const uri = await snapshot;
        this.mapStructure.image = uri
        return uri
    }
    //SNAPSHOT..........................................................


    //CALCUL DISTANCE, DENIVELE, VITESSE MOYENNE...............................
    position = {}
    calculDistance = async () => {

        //CHANGE const par var points
        var points = [];
        this.mapStructure.positions.forEach(position => {
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
                this.mapStructure.totalRunInMeters = totalDistance.toFixed(2)

                //DENIVELE Calcul de la différence de hauteur entre les deux points 
                const elevationDifference = p2.coords.altitude - p1.coords.altitude;
                if (!isNaN(elevationDifference)) {
                    totalElevationGain += elevationDifference;
                }
                this.mapStructure.elevationGain = totalElevationGain.toFixed(2);
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
                this.mapStructure.averageSpeed = averageSpeed.toFixed(2);
                // console.log("ALLURE MOYENNE",averageSpeed, ": km/heures");
                // console.log(duration)
            }
            //ALLURE
            const timeInMinutes = totalTime / 60000;
            const allure = timeInMinutes / (totalDistance / 1000); //on divise par 1000 pour avoir des metres
            this.mapStructure.paceSpeed = allure.toFixed(2)
            // console.log("ALLURE",allure,"minutes par km");
        }
    }
    //...............................CALCUL DISTANCE, DENIVELE, VITESSE MOYENNE

    //GPX...................................................................async car await pour le path
    convertToGpx = async () => {
        const gpsPoints = this.mapStructure.positions.map((location) => ({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            elevation: location.coords.altitude,
            time: new Date(location.timestamp).toISOString(),
        }));

        const data = {
            waypoints: gpsPoints,
            activityType: 'Running ' + this.mapStructure.city,
            startTime: new Date().toISOString(),
        };

        const gpx = createGpx(data.waypoints, {
            activityName: data.activityType,
            startTime: data.startTime,
        });
        // console.log("GPX", gpx);
        // pathGpx est dans le mapStructure
        this.mapStructure.pathGpx = gpx;

    };

    
    //...................................................................GPX



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

//singleton
const mapService = new MapService();
export default mapService