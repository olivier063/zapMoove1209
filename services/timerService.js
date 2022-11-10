import { Observable, ReplaySubject } from "rxjs";

class TimerService {
    maxTime = 30;
    timerDown = null;
    seconds = 0;
    minutes = 0;
    timerChange = new ReplaySubject();
    
    constructor(maxTime){
        this.maxTime = maxTime;
        this.setTimer();
      

        // console.log(this)
    }
    
    startTimer() {
        this.timerDown = setInterval(() => {

            if (this.seconds > 0) {
                this.seconds = this.seconds -1
            }
            if (this.seconds === 0) {
                if (this.minutes === 0) {
                    // this.stopTimer();
                } else {
                    this.minutes = this.minutes -1
                    this.seconds = 59
                }
            }
            this.timerChange.next({seconds: this.seconds, minutes: this.minutes})
        }, 1000)
    }
    stopTimer(reset = false){
        clearInterval(this.timerDown);
        this.timerDown = null;
        this.timerChange.next({seconds: this.seconds, minutes: this.minutes});
        if (reset){
            this.setTimer();
        }
        
    }

    getTimerDown(){
        return this.timerDown;
    }
    getMinutes(){
        return this.minutes;
    }
    getSeconds(){
        return this.seconds;
    }
    setTimer(){
        this.minutes = Math.floor(this.maxTime / 60);
        this.seconds = this.maxTime - this.minutes * 60;
        this.timerChange.next({seconds: this.seconds, minutes: this.minutes});
    }
}



   
export default TimerService;