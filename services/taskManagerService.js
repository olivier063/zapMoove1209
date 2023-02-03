import * as TaskManager from 'expo-task-manager';
import mapService from './mapService';




const TIMER_TASK_NAME = 'background-timer-task';
const LOCATION_TASK_NAME = 'background_location_task';


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
      [{
        taskType: "test"
      }]
      console.log("TASKS",tasks);

    } catch (error) {
      console.error(error);
    }

    //DEMANDE SI LA TACHE EST BIEN ENREGISTREE
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
      if (isRegistered) {
        console.log(`Task '${LOCATION_TASK_NAME}' is registered.`);
        
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




  chronoBackground = async () => {

    // Défini une fonction qui sera appelée lorsque la tâche en arrière-plan est démarrée
    // TaskManager.defineTask(TASK_NAME, ({ data, error }) => {
    //     if (error) {
    //         console.error(error);
    //         return;
    //     }
    //     if (data) {
    //         const { locations } = data;
    //         console.log(locations);
    //         // Mettre à jour votre chronomètre ici
    //     }
    // });

    // const startBackgroundTask = async () => {
    //     await Location.startLocationUpdatesAsync(TASK_NAME, {
    //         accuracy: Location.Accuracy.Balanced,
    //         timeInterval: 1000,
    //         distanceInterval: 1,
    //     });
    // };

    // const stopBackgroundTask = async () => {
    //     await Location.stopLocationUpdatesAsync(TASK_NAME);
    // };


    TaskManager.defineTask(TIMER_TASK_NAME, ({ data, error }) => {
      if (error) {
        console.error(error);
        return;
      }
      if (data) {
        console.log(data);
        // Mettre à jour votre chronomètre ici
      }
    });

    const startBackgroundTask = () => {
      TaskManager.runTask(TIMER_TASK_NAME, {
        // optionnel, vous pouvez passer des données à votre tâche en arrière-plan
        data: {},
      });
    };
  }






}

const taskManagerService = new TaskManagerService();
export default taskManagerService;


