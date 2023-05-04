import * as TaskManager from 'expo-task-manager';
import mapService from './mapService';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { ReplaySubject } from 'rxjs';

const LOCATION_TASK_NAME = 'background_location_task';

const GEOFENCING_TASK_NAME = 'myGeofencingTask';


class TaskManagerService {
  regionChange = new ReplaySubject();

  backgroundLocation = () => {
    TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
      if (error) {
        // Error occurred - check `error.message` for more details.
        return;
      }
      if (data) {
        const { locations } = data;
        // do something with the locations captured in the background
        // console.log("LOCATION TASK MANAGER SERVICE",locations)

        this.getRegisteredTasks();
        mapService.onPositionChange(locations[0])
      }
    });
  }

  //LES TACHES DOIVENT ETRES ENREGISTREES POUR PERMETTRE PAR LA SUITE DE LES DESACTIVER
  getRegisteredTasks = async () => {
    try {
      const tasks = await TaskManager.getRegisteredTasksAsync();
      // console.log("TASKS",tasks);

    } catch (error) {
      console.error(error);
    }

    //DEMANDE SI LA TACHE EST BIEN ENREGISTREE
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
      if (isRegistered) {
        // console.log(`Task '${LOCATION_TASK_NAME}' is registered.`);

      } else {
        console.log(`Task '${LOCATION_TASK_NAME}' is not registered.`);
      }
    } catch (error) {
      console.error(error);
    }

  }

  // ON DESACTIVE LA TACHE LOCATION-TASK-NAME PREALABLEMENT ENREGISTREE QUI GERE LA GEOLOCALISATION
  unregisterTask = async (LOCATION_TASK_NAME) => {

    try {
      await TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME);
      console.log(`Task '${LOCATION_TASK_NAME}' unregistered successfully.`);
    } catch (error) {
      console.error(error);
    }
  }


  //GEOFENCING REGION............................................


  defineTaskRegion = () => {
    TaskManager.defineTask(GEOFENCING_TASK_NAME, ({ data: { eventType, region }, error }) => {
      if (error) {
        console.error('Geofencing task error:', error);
        return;
      }
      if (eventType === Location.GeofencingEventType.Enter) {
        // console.log(`Entered geofence ${region.identifier}`);
        console.log('vous êtes dans la zone')
        // Alert.alert("vous êtes dans la zone")

        this.regionChange.next(true);

      } else if (eventType === Location.GeofencingEventType.Exit) {
        // console.log(`Exited geofence ${region.identifier}`);
        console.log("vous êtes à l'exterieur la zone, rapprochez vous")
        Alert.alert("Vous êtes à l'exterieur la zone, rapprochez vous!!")
        this.regionChange.next(false);
      }
      this.getRegisteredTasksRegion();
      // mapService.onPositionChange(locations[0])
    });
  }


  //LES TACHES DOIVENT ETRES ENREGISTREES POUR PERMETTRE PAR LA SUITE DE LES DESACTIVER
  getRegisteredTasksRegion = async () => {
    try {
      const tasks = await TaskManager.getRegisteredTasksAsync();
      console.log("TASKS", tasks);

    } catch (error) {
      console.error(error);
    }

    //DEMANDE SI LA TACHE EST BIEN ENREGISTREE
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(GEOFENCING_TASK_NAME);
      if (isRegistered) {
        console.log(`Task '${GEOFENCING_TASK_NAME}' is registered.`);

      } else {
        console.log(`Task '${GEOFENCING_TASK_NAME}' is not registered.`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // ON DESACTIVE LA TACHE LOCATION-TASK-NAME PREALABLEMENT ENREGISTREE QUI GERE LA GEOLOCALISATION
  unregisterTaskRegion = async (GEOFENCING_TASK_NAME) => {
    try {
      await TaskManager.unregisterTaskAsync(GEOFENCING_TASK_NAME);
      console.log(`Task '${GEOFENCING_TASK_NAME}' unregistered successfully.`);
    } catch (error) {
      console.error(error);
    }
  }

  //............................................GEOFENCING REGION


}

const taskManagerService = new TaskManagerService();
export default taskManagerService;


