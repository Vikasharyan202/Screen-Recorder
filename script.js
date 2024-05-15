let video = document.querySelector("video");
let recordBtnContainer = document.querySelector(".record_btn_container");
let recordBtn = document.querySelector(".record_btn");
let captureBtnContainer = document.querySelector(".capture_btn_container");
let captureBtn = document.querySelector(".capture_btn");
let recordFlag = false;
let transparentColor = "transparent";

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
        // let videoURL = URL.createObjectURL(blob);

        if(database) {
            let videoID = shortid();
            let dbTransaction = database.transaction("video", "readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id: `vid-${videoID}`,
                blobData: blob
            }
            videoStore.add(videoEntry);
        }
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

captureBtnContainer.addEventListener("click", (e) => {
    captureBtn.classList.add("scale_capture");
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext('2d');
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);
    //Filter
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    let imageURL = canvas.toDataURL();

    if(database) {
        let imageID = shortid();
        let dbTransaction = database.transaction("image", "readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id: `img-${imageID}`,
            imageData: imageURL
        }
        imageStore.add(imageEntry);
    }

    setTimeout(() => {
        captureBtn.classList.remove("scale_capture");
    }, 500)
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

// Filtering Logic
let filterLayer = document.querySelector(".filter_layer");
let allFilter = document.querySelectorAll(".filter");
allFilter.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) => {
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transparentColor;
    })
})