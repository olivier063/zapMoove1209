import { Observable, ReplaySubject } from "rxjs";



class TimerTrainingService {
    maxTime = 30;
    timerDown = null;
    seconds = 0;
    minutes = 0;
    hours = 0;
    timerChange = new ReplaySubject();

    constructor(maxTime) {
        this.maxTime = maxTime;
    }

    
    startTimer() {

        this.timerDown = setInterval(() => {
            if (this.seconds >= 0) {
                this.seconds = this.seconds + 1
            }

            if (this.seconds === 60) {

                this.minutes = this.minutes + 1
                this.seconds = 0

                if (this.minutes === 60) {
                    this.hours = this.hours + 1;
                    this.minutes = 0
                } 
            }
            this.timerChange.next({ seconds: this.seconds, minutes: this.minutes, hours: this.hours })
        }, 1000)
    }

    stopTimer(reset = false) {
        clearInterval(this.timerDown);
        this.timerDown = null;
        this.timerChange.next({ seconds: this.seconds, minutes: this.minutes, hours: this.hours });
        if (reset) {
            this.setTimer();
        }
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

        this.minutes = Math.floor(this.maxTime / 60);
        this.seconds = this.maxTime - this.minutes * 60;

        this.hours = Math.floor(this.minutes / 60);
        this.minutes = this.minutes - this.hours * 60;

        this.timerChange.next({ seconds: this.seconds, minutes: this.minutes, hours: this.hours });
    }
}




export default TimerTrainingService;