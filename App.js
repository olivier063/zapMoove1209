
import { StyleSheet, TouchableOpacity, Image, } from 'react-native';
import Logo from './components/logo';
import EscapeRunChoixCourse from './screens/escapeRunChoixCourse';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CourseConnecteeChoixCourse from './screens/courseConnecteeChoixCourse';
import CompetitionChoixCourse from './screens/competitionChoixCourse';
import ExerciceMenu from './screens/exerciceMenu';
import Exercices from './screens/exercices';
import ExercicesNiveau1 from './screens/exercicesNiveau1';
import GeneralExercicesNiveau1 from './screens/generalExercicesNiveau1';
import StartExercices from './screens/startExercices'
import Timer from './screens/timer';
import Compte from './screens/compte';
import LienYoutube from './screens/lienYoutube';
import Login from './screens/login';
import Home from './screens/home';
import TestCondition from './screens/testCondition';
import EditAccount from './screens/editAccount';
import PresentationEscape from './screens/presentationEscape';
import EscapeRunHistory from './screens/escapeRunHistory';
// import Chrono from './components/chrono';
import TrainingPointsExplications from './screens/trainingPointsExplications';
import TrainingState from './screens/trainingState';
import TrainingHistory from './screens/trainingHistory';
import TrainingStateHistory from './screens/trainingStateHistory';
import TrainingMapView3 from './screens/trainingMapView3';
import * as TaskManager from 'expo-task-manager';
// import CourseConnecteeEnvoiGpx from './screens/courseConnecteeEnvoiGpx';
import CourseConnecteeDetailCourse from './screens/courseConnecteeDetailCourse';
import CourseConnecteeMapView from './screens/courseConnecteeMapView';
import CourseConnecteeState from './screens/courseConnecteeState';
import CourseConnecteeChoixEnvoiGpx from './screens/courseConnecteeChoixEnvoiGpx';
import CourseConnecteeDetailEnvoiGpx from './screens/courseConnecteeDetailEnvoiGpx';



//Pour eviter une erreur du Task Manager, je le mets dans le App Entry (vu StackOverFlow)
const LOCATION_TASK_NAME = 'background_location_task';
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data;
    // do something with the locations captured in the background
  }
}); 

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <>
      <StatusBar />
      <Logo />

      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="MENU PRINCIPAL" component={Home} // options et headerRight permettent de placer un icone dans la barre du menu
            options={({ navigation }) => ({
              headerRight: () => <TouchableOpacity onPress={() => navigation.navigate("CONNEXION")}>
                <Image source={require("./assets/connection.png")}
                  resizeMode="contain"
                  style={styles.image} />
              </TouchableOpacity>
            })}
          />
          <Stack.Screen name="CHOIX ESCAPE RUN" component={EscapeRunChoixCourse} 
           options={({ navigation }) => ({
            headerRight: () => <TouchableOpacity onPress={() => navigation.navigate("HISTORIQUE")}>
              <Image source={require("./assets/imageHistorique.png")}
                resizeMode="contain"
                style={styles.imageHistorique} />
            </TouchableOpacity>
          })}
          />
          {/* <Stack.Screen name="CHRONO" component={Chrono} /> */}
          <Stack.Screen name="HISTORIQUE" component={EscapeRunHistory} />
          <Stack.Screen name="PRESENTATION ESCAPE" component={PresentationEscape} />
          <Stack.Screen name="CHOIX COURSE CONNECTEE" component={CourseConnecteeChoixCourse} />
          <Stack.Screen name="CHOIX COMPETITION" component={CompetitionChoixCourse} />
          <Stack.Screen name="CHOISIR UN MODE" component={ExerciceMenu} 
           options={({ navigation }) => ({
            headerRight: () => <TouchableOpacity onPress={() => navigation.navigate("TRAINING HISTORIQUE")}>
              <Image source={require("./assets/imageHistorique.png")}
                resizeMode="contain"
                style={styles.imageHistorique} />
            </TouchableOpacity>
          })}
          />
          <Stack.Screen name="CHOISIR UN ENTRAINEMENT" component={Exercices} />
          <Stack.Screen name="ENTRAINEMENTS" component={GeneralExercicesNiveau1} />
          <Stack.Screen name="START EXERCICES" component={StartExercices} />
          <Stack.Screen name="EXERCICES NIVEAU 1" component={ExercicesNiveau1} />
          <Stack.Screen name="TIMER" component={Timer} />
          <Stack.Screen name="INSCRIPTION" component={Compte} />
          <Stack.Screen name="YOUTUBE" component={LienYoutube} />
          <Stack.Screen name="CONNEXION" component={Login} />
          <Stack.Screen name="TEST CONDITION" component={TestCondition} />
          <Stack.Screen name="MODIFIER LE COMPTE" component={EditAccount} />
          <Stack.Screen name="EXPLICATION DES POINTS" component={TrainingPointsExplications} />
          {/* option={{headerShown: false}} permet de ne pas afficher la barre de titre et donc la navigation arriere */}
          <Stack.Screen name="TRAINING STATE" component={TrainingState} options={{headerShown: false}} /> 
          <Stack.Screen name="TRAINING HISTORIQUE" component={TrainingHistory} />
          <Stack.Screen name="TRAINING STATE HISTORIQUE" component={TrainingStateHistory} />
          <Stack.Screen name="MAP VIEW" component={TrainingMapView3} />
          {/* <Stack.Screen name="CHOISISSEZ UNE COURSE" component={CourseConnecteeEnvoiGpx} /> */}
          <Stack.Screen name="DETAIL COURSE" component={CourseConnecteeDetailCourse} />
          <Stack.Screen name="COURSE MAP VIEW" component={CourseConnecteeMapView} />
          <Stack.Screen name="COURSE STATE" component={CourseConnecteeState} />
          <Stack.Screen name="COURSE GPX" component={CourseConnecteeChoixEnvoiGpx} />
          <Stack.Screen name="DETAIL ENVOI GPX" component={CourseConnecteeDetailEnvoiGpx} />

        </Stack.Navigator>
      </NavigationContainer>

    </>
  );
}


const styles = StyleSheet.create({
  image: {
    height: 60,
    width: 100,
    borderRadius: 50,
  },

  imageHistorique:{
    height: 30,
    width: 100,
  },

})