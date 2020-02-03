// console.log('watch');

function stopWatch(element){
    var time = 0;
    var interval;
    var offset;
    // start()

    function update() {
    
        if(this.isOn){
            time += delta();
        }
        var formattedTime = timeFormatter(time);
        element.textContent = formattedTime;
    };

    function delta() {
        var now = Date.now();
        var timePassed = now - offset;
        offset = now;
        return timePassed;
    };
    
    function timeFormatter(timeInMilliseconds) {
        var time = new Date(timeInMilliseconds);
        var minutes = time.getMinutes().toString();
        var seconds = time.getSeconds().toString();
        // var milliseconds = time.getMilliseconds().toString();

        if (minutes.length < 2) {
            minutes = '0' + minutes;
            }
        
            if (seconds.length < 2) {
            seconds = '0' + seconds;
            }

            // while (milliseconds.length < 3) {
            //     milliseconds = '0' + milliseconds;
            // }
        
            return `${minutes}:${seconds}`
        }

    
    
    this.isOn = false;

    this.start = function () {
        if (!this.isOn) {
            interval = setInterval(update.bind(this), 10);
            offset = Date.now();
            this.isOn = true;
            // document.getElementById("toggleBtn").innerHTML = "Stop"
        }
    };
    this.stop = function () {
        if (this.isOn) {
            clearInterval(interval);
            interval = null;
            this.isOn = false;
            // document.getElementById("toggleBtn").innerHTML = "Start"

            
        }
        
    };
    this.reset = function () {
        time = 0;
        var formattedTime = timeFormatter(time);
        element.textContent = formattedTime;    
        
    };
    this.isOn = false;
};




