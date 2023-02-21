import * as TaskManager from 'expo-task-manager';
import mapService from './mapService';


const LOCATION_TASK_NAME = 'background_location_task';
const POLYLINE_TASK_NAME = 'polyline_task'



class TaskManagerService {

  backgroundLocation = () => {
    TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
      if (error) {
        // Error occurred - check `error.message` for more details.
        return;
      }
      if (data) {
        const { locations } = data;
        // do something with the locations captured in the background
        console.log("LOCATION",locations)
        
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


  backgroundPolyline = () => {
    TaskManager.defineTask(POLYLINE_TASK_NAME, ({ data, error }) => {
      if (error) {
        // Error occurred - check `error.message` for more details.
        return;
      }
      if (data) {
        const { locations } = data;
        // do something with the locations captured in the background
        // console.log("LOCATION",locations)
        

        mapService.userLocation(locations)
        console.log('COORDINATES',coordinates)
      }
    });
  }



}

const taskManagerService = new TaskManagerService();
export default taskManagerService;


