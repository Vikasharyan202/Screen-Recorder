// Open a database
//Create database
//Store into them
let database;
let openRequest = indexedDB.open("myDataBase");
openRequest.addEventListener("success", (e) => {
    console.log("DB Success");
    database = openRequest.result;
})
openRequest.addEventListener("error", (e) => {
    console.log("DB error");
})
openRequest.addEventListener("upgradeneeded", (e) => {
    console.log("DB upgraded and also for initial DB creation");
    database = openRequest.result;

     database.createObjectStore("video", {keyPath: "id"});
     database.createObjectStore("image", {keyPath: "id"});
})