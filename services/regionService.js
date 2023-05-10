import { Observable, ReplaySubject } from "rxjs";
import * as Location from 'expo-location';
import taskManagerService from "./taskManagerService";

const GEOFENCING_TASK_NAME = 'myGeofencingTask';

class RegionService {

    regionStructure = {
        identifier: 'MyGeofence',
        latitude: 0,
        longitude: 0,
        radius: 0,
        notifyOnEnter: true,
        notifyOnExit: true,
    }
    
    startGeofencing = async (regionStructure) => {
    //    this.regionStructure = {
    //         identifier: 'MyGeofence',
    //         latitude: parseFloat(regionStructure.latitude),
    //         longitude: parseFloat(regionStructure.longitude),
    //         rayon: parseFloat(regionStructure.rayon),
    //         notifyOnEnter: true,
    //         notifyOnExit: true,
    //     }

        this.regionStructure.latitude = parseFloat(regionStructure.latitude);
        this.regionStructure.longitude = parseFloat(regionStructure.longitude);
        this.regionStructure.radius = parseFloat(regionStructure.rayon);

        const regions = [
        this.regionStructure
        ];
        await Location.startGeofencingAsync(GEOFENCING_TASK_NAME, regions, {
            accuracy: Location.Accuracy.High,
            loiteringDelay: 1000,
        });

        taskManagerService.defineTaskRegion();
    }




}


const regionService = new RegionService();
export default regionService;
