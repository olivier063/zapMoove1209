// import React, { Component } from 'react';
// import { Text, View } from 'react-native';
// import timerEscapeService from '../services/timerEscapeService';

// export default class EscapeRunCountDownGeneral extends Component {
//   // constructor(props) {
//   //   super(props);
//   //   console.log('PROPS COUNT GENERAL', this.props.timeRemaining);
//   //   this.state = {
//   //     timeRemaining: 0,
//   //   };
//   // }

//   timerEscapeService = null;
//   constructor(props) {
//       super(props);

//       // console.log("PROPS COUNT D GENERAL", this.props)
//       const timeRemaining = 0;
//       this.timerEscapeService = timerEscapeService;
//       this.timerEscapeService.setTimeRemaining(timeRemaining);
      
//       this.timerEscapeService.timerChange.subscribe(state => {
//           this.setState({
//               minutes: this.timerEscapeService.getMinutes(),
//               seconds: this.timerEscapeService.getSeconds(),
//               hours: this.timerEscapeService.getHours(),
//           })
//       })
//       this.state = {
//         timeRemaining: 0,
//       }
//   }







//   getEscapeScenario = async () => {
//     try {
//       const response = await fetch(this.props.prop);
//       const json = await response.json();
//       this.setState({
//         timeRemaining: json.TEMPS_MAX
//       })

//     } catch (error) {
//       console.log(error);
//     }
//   }


//   async componentDidMount() {
//     await this.getEscapeScenario();
//     if (this.state.timeRemaining > 0) {
//       this.interval = setInterval(() => this.getTimer(), 1000);
//     }
//   }

//   componentWillUnmount() {
//     clearInterval(this.interval);
//   }


//   getTimer = async () => {
//     if (this.state.timeRemaining > 0) {
//       this.setState({
//         timeRemaining: this.state.timeRemaining - 1,
//       });
//     } else {
//       clearInterval(this.interval);
//     }
//   };

//   //MIS A JOUR DU COUNT DOWN SELON BONNE OU MAUVAISE REPONSE................
//   updateTimeRemaining = (isAnswerCorrect) => {
//     const timeDiff = isAnswerCorrect ? 60 : -60;
//     const newTimeRemaining = this.state.timeRemaining + timeDiff;
//     this.setState({ timeRemaining: newTimeRemaining });
//   }

//   checkAnswer = (answer) => {
//     if (answer === this.props.correctAnswer) {
//       this.props.updateTimeRemaining(this.props.timeRemaining + 60);
//       // mettre à jour le timeRemaining de parent en ajoutant 60 secondes
//     } else {
//       this.props.updateTimeRemaining(this.props.timeRemaining - 60);
//       // mettre à jour le timeRemaining de parent en retirant 60 secondes
//     }
//   }
//   //................MIS A JOUR DU COUNT DOWN SELON BONNE OU MAUVAISE REPONSE

//   render() {
//     const { timeRemaining } = this.state;

//     const hours = Math.floor(timeRemaining / 3600);
//     const minutes = Math.floor((timeRemaining - hours * 3600) / 60);
//     const seconds = timeRemaining % 60;

//     return (
//       <View>
//         <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
//           {hours.toString().padStart(2, '0')}:
//           {minutes.toString().padStart(2, '0')}:
//           {seconds.toString().padStart(2, '0')}
//         </Text>
//       </View>
//     );
//   }
// }


import React, { Component } from 'react';
import { Text, View } from 'react-native';
import timerEscapeService from '../services/timerEscapeService';

export default class EscapeRunCountDownGeneral extends Component {
  constructor(props) {
    super(props);
    const timeRemaining = 0;
    this.timerEscapeService = timerEscapeService;
    this.timerEscapeService.setTimeRemaining(timeRemaining);
    this.timerEscapeService.timerChange.subscribe(state => {
      // console.log(state)
      this.setState({
        minutes: state.minutes,
        seconds: state.seconds,
        hours: state.hours,
      })
    })
    this.state = {
      // timeRemaining: 0,
      minutes: 0,
      seconds: 0,
      hours: 0,
    }
  }

  async componentDidMount() {
   const timeRemaining = await this.getEscapeScenario();
    // console.log('TATA')
    // console.log('STATE', this.state)
    if (timeRemaining > 0) {
      this.timerEscapeService.startTimer();
    }
  }


  componentWillUnmount() {
    this.timerEscapeService.stopTimer();
  }

  getEscapeScenario = async () => {
    return new Promise ( async (resolve, reject) => {
      try {
        const response = await fetch(this.props.prop);
        const json = await response.json();
        this.timerEscapeService.setTimeRemaining(json.TEMPS_MAX);
        this.timerEscapeService.setTimer();
        resolve(json.TEMPS_MAX);
      } catch (error) {
        console.log(error);
      }
    
   });
   
  }

  render() {

    const hours = this.state.hours;
    const minutes = this.state.minutes;
    const seconds = this.state.seconds;
    return (
      <View>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
          {hours.toString().padStart(2, '0')}:
          {minutes.toString().padStart(2, '0')}:
          {seconds.toString().padStart(2, '0')}
        </Text>
      </View>
    );
  }
}
