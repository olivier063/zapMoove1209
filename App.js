
import { StyleSheet, Text, View } from 'react-native';
import Home from './screens/home';
import Logo from './components/logo';
import EscapeRunChoixCourse from './screens/escapeRunChoixCourse';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, StackActions } from '@react-navigation/native';
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



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar/>
      <Logo/>
      
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="MENU PRINCIPAL" component={Home} />
          <Stack.Screen name="CHOIX ESCAPE RUN" component={EscapeRunChoixCourse} />
          <Stack.Screen name="CHOIX COURSE CONNECTEE" component={CourseConnecteeChoixCourse} />
          <Stack.Screen name="CHOIX COMPETITION" component={CompetitionChoixCourse} />
          <Stack.Screen name="CHOISIR UN MODE" component={ExerciceMenu} />
          <Stack.Screen name="CHOISIR UN ENTRAINEMENT" component={Exercices} />
          <Stack.Screen name="ENTRAINEMENTS" component={GeneralExercicesNiveau1} />
          <Stack.Screen name="START EXERCICES" component={StartExercices} />   
          <Stack.Screen name="EXERCICES NIVEAU 1" component={ExercicesNiveau1} /> 
          <Stack.Screen name="TIMER" component={Timer} /> 
          <Stack.Screen name="COMPTE" component={Compte} />
          <Stack.Screen name="YOUTUBE" component={LienYoutube} />           
        </Stack.Navigator>
      </NavigationContainer>
     
    </>
  );
}


