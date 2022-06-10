//a function that takes a parameter and returns a promise
function makeRequest(location) {
  return new Promise((resolve, reject) => {
    console.log("Making request to " + location);

    if (location === "Google") {
      resolve("Hello from Google!"); //this is resolve msg, not print
    } else {
      reject("We can only talk to google :(");
    }
  });
}

//now another function
function processRequest(response) {
  return new Promise((resolve, reject) => {
    console.log("Processing response...");
    resolve("Extra information " + response);
  });
}

//now call the functions --> without async and await, comment this out to only view async await

makeRequest("Google") //or "Facebook"
  .then((response) => {
    console.log("Response received"); //note that the actual response isn't printed, only this line is

    //and now we call the next function, which actually returns a promise itself
    //to deal with that promise we return it here and deal with it in the subsequent 'then'

    return processRequest(response); //sends response of first function here
  })
  .then((processedResponse) => {
    console.log(processedResponse); //this prints output of 2nd function
  })
  .catch((err) => {
    console.log(err);
  });

console.log(
  "================================================================================================="
);

//Now this whole thing involves many then() here and there, kinda confusing
//better to use async await
//function is called async, and whichever line returns a promise can be await
//thus the execution of that function will pause, while a particular line is processing and node wil then carry out some other work
//as soon as promise is returned, execution comes back inside the function and proceeds
//value returned by async line is the 'resolve'. we use try-catch to deal with rejects appropriately.

async function doWork() {
  try {
    const response = await makeRequest("Google");
    console.log("Response received");
    const processedResponse = await processRequest(response);
    console.log(processedResponse);
  } catch (err) {
    console.log(err);
  }
}

doWork();

//you can see where ======= is printed based on what is getting called where
//the orders are not the same as something else might be executed while something is waiting!!
