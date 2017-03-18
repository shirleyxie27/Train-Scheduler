// Initialize Firebase
  var config = {
    apiKey: "AIzaSyA2uoUObrvHXH9vVjCR-gh9NzBwNArBark",
    authDomain: "trainschedule-b52f0.firebaseapp.com",
    databaseURL: "https://trainschedule-b52f0.firebaseio.com",
    storageBucket: "trainschedule-b52f0.appspot.com",
    messagingSenderId: "743663673921"
  };
  firebase.initializeApp(config);

//Graba current data&time and show on DOM (jumbotron) 
var userTime = moment().format("MMM DD YYYY, hh:mm A");
    $("#userTime").append(userTime);

var database = firebase.database();


// Grab user input data
function addTrain(event) {

    //Prevent refresh the page
    event.preventDefault();

    // console.log
    var name = $("#name").val().trim(), 
        destination = $("#destination").val().trim(),
        firstTrainTime = $("#first-train-time").val().trim(),
        frequency = $("#frequency").val().trim();
    
    console.log(name, destination, firstTrainTime, frequency);

    //Push to database
    var train = {};

        train.name = $("#name").val().trim();
        train.destination = $("#destination").val().trim();
        train.firstTrainTime = $("#first-train-time").val().trim();
        train.frequency = $("#frequency").val().trim();
        train.dateAdded = firebase.database.ServerValue.TIMESTAMP;

    database.ref().push(train);

    $("form").find("input").val("");
    
};

$(".submit").on("click", addTrain);


//add each trains data into the table   
function trainData() {

    database.ref().on("child_added", function(data) {
        console.log(data.val());
    
   // Calculate next arrival time, minutes away 
    var frequency = data.val().frequency;
    // var frequency = $("#frequency").val().trim();
    // if (!frequency) {
    //  frequency = data.val().frequency;
    // }
    var firstTrainTime = data.val().firstTrainTime; 
    // var firstTrainTime = $("#first-train-time").val().trim();
    // if (!firstTrainTime) {
    //  firstTrainTime = data.val().firstTrainTime;
    // }
    console.log(firstTrainTime); //ここで時間がつかまれなかったので line 58-67でfirebaseからfrequency&firstTrainTimeのdataを取るように設定した。

    // Converting firstTrainTime
    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current time
    var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("hh:mm A")); 
    
    // Difference between the firstTrainTime and currentTIme
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Time Difference: " + diffTime);

    // Remainder
    var remainder = diffTime % frequency;
    console.log(remainder);

    // Minute until train
    var minutesTillTrain = frequency - remainder;
    console.log("Minuted Till Train: " + minutesTillTrain);

     // Next train
    var nextTrain = moment().add(minutesTillTrain, "minutes").format("hh:mm A");
    console.log("Next Train: " + nextTrain);
   

        
        $("tbody").append(
            "<tr>" + 

            "<th>" + data.val().name + 

            "<th>" + data.val().destination   +  

            "<th>" + data.val().frequency +  

            "<th>" + nextTrain + 

            "<th>" + minutesTillTrain
            
            );

    });

};

trainData();