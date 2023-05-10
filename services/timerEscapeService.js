import { Observable, ReplaySubject } from "rxjs";



class TimerEscapeService {
    timeRemaining = 0;
    timerDown = null;
    seconds = 0;
    minutes = 0;
    hours = 0;
    timerChange = new ReplaySubject();

    // constructor(timeRemaining) {
    //     this.timeRemaining = timeRemaining;
    // }

    setTimeRemaining(timeRemaining){
        this.timeRemaining = timeRemaining
    }
    
    startTimer() {
        this.timerDown = setInterval(() => {
            if (this.seconds > 0 || this.minutes > 0 || this.hours > 0) {
                this.seconds = this.seconds - 1;
    
                if (this.seconds < 0) {
                    this.minutes = this.minutes - 1;
                    this.seconds = 59;
    
                    if (this.minutes < 0) {
                        this.hours = this.hours - 1;
                        this.minutes = 59;
                    } 
                }
            } 
            this.timerChange.next({ seconds: this.seconds, minutes: this.minutes, hours: this.hours });
        }, 1000);
    }
    

    stopTimer(reset = false) {
        clearInterval(this.timerDown);
        this.timerDown = null;
        this.timerChange.next({ seconds: this.seconds, minutes: this.minutes, hours: this.hours });
        if (reset) {
            this.setTimer();
        }
    }

    // creer la meme en mode -=
    removeFromTimer(timeToRemoveInSeconds){
        let totalInSeconds = this.seconds + this.minutes * 60 + this.hours * 3600;
        // console.log('TOTAL', totalInSeconds)
        totalInSeconds += timeToRemoveInSeconds;
        // console.log('TOTAL 2', totalInSeconds)
        this.hours = Math.floor(totalInSeconds / 3600);
        this.minutes = Math.floor((totalInSeconds - this.hours * 3600) / 60);
        this.seconds = totalInSeconds % 60;

        this.timerChange.next({ seconds: this.seconds, minutes: this.minutes, hours: this.hours });

    }

    getTimerDown() {
        return this.timerDown;
    }
    getMinutes() {
        return this.minutes;
    }
    getSeconds() {
        return this.seconds;
    }

    getHours() {
        return this.hours;
    }
    

    setTimer() {

        this.minutes = Math.floor(this.timeRemaining / 60);
        this.seconds = this.timeRemaining - this.minutes * 60;

        this.hours = Math.floor(this.minutes / 60);
        this.minutes = this.minutes - this.hours * 60;

        this.timerChange.next({ seconds: this.seconds, minutes: this.minutes, hours: this.hours });
    }
}



const timerEscapeService = new TimerEscapeService();
export default timerEscapeService;
