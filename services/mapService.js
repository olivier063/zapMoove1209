import StorageService from './storageService';
import * as Location from 'expo-location';


class MapService {

    async askPermission() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            return true
            // const { backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
            // if (backgroundStatus === 'granted') {
            //     return true
            // }
        }
        return false
    }







}


const mapService = new MapService();
export default mapService