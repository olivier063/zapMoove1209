import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { lastValueFrom } from 'rxjs';
import { isSearchBarAvailableForCurrentPlatform } from 'react-native-screens';

const TASK_NAME = 'background-timer-task';

class TaskManagerService {



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


        TaskManager.defineTask(TASK_NAME, ({ data, error }) => {
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
            TaskManager.runTask(TASK_NAME, {
              // optionnel, vous pouvez passer des données à votre tâche en arrière-plan
              data: {},
            });
          };

          


                    

    }
}

const taskManagerService = new TaskManagerService();
export default taskManagerService;


