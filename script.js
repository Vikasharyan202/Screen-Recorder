let video = document.querySelector("video");
let recordBtnContainer = document.querySelector(".record_btn_container");
let recordBtn = document.querySelector(".record_btn");
let captureBtnContainer = document.querySelector(".capture_btn_container");
let captureBtn = document.querySelector(".capture_btn");
let recordFlag = false;

let recorder;
let chunks = []; // Media data in chunks

let constraints = {
    video: true,
    audio: true,
}

navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    video.srcObject = stream;
    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start", (e) => {
        chunks = [];
    })
    recorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
    })
    recorder.addEventListener("stop", (e) => {
        // convert media chunks into video data
        let blob = new Blob(chunks, {type: "video/mp4"});
        let videoURL = URL.createObjectURL(blob);

        let a = document.createElement("a");
        a.href = videoURL;
        a.download = "myrecording.mp4";
        a.click();
    })
})

recordBtnContainer.addEventListener("click", (e) => {
    if(!recorder) return;

    recordFlag = !recordFlag;

    if(recordFlag) {
        // start recording
        recorder.start();
        recordBtn.classList.add("scale_record");
        startTimer();
    }else {
        // stop recording
        recorder.stop();
        recordBtn.classList.remove("scale_record");
        stopTimer();
    }
})

// Timer
let timerID;
let counter = 0;
let timer = document.querySelector(".timer");
function startTimer() {
    timer.style.display = "block";
    function displayTimer() {
        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds/3600);
        totalSeconds = totalSeconds % 3600;

        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;

        let seconds = totalSeconds;

        hours = (hours < 10)?`0${hours}`:hours;
        minutes = (minutes < 10)?`0${minutes}`:minutes;
        seconds = (seconds < 10)?`0${seconds}`:seconds;

        timer.innerHTML = `${hours}:${minutes}:${seconds}`;
        counter++;
    }
    timerID = setInterval(displayTimer, 1000);
    
}

function stopTimer() {
    clearInterval(timerID);
    timer.innerText = "00:00:00";
}