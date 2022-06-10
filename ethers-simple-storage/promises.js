//takes 1 param, which is a function that gets passed 2 variables (resolve and reject)
let p = new Promise((resolve, reject) => {
  let a = 1 + 1; //1+2 would reject
  if (a == 2) {
    resolve("Success!");
  } else {
    reject("Failed!");
  }
});

//interact with promises - anything in then() runs with resolve
p.then((message) => {
  console.log("This is in the then --> " + message);
}).catch((message) => {
  console.log("This is in the catch --> " + message);
});

/* 
Here p is a promise
Great for when you want to do something that is going to take a long time - download img from server and do something after it is completed
Promises are meant to replace callbacks. Lot easier.
*/

let userLeft = true;
let userWatchingCatMeme = true;

//define function that returns a promsise
function watchTutorialPromise() {
  return new Promise((resolve, reject) => {
    if (userLeft) {
      reject({
        name: "User left",
        message: ":/ :/ :/",
      });
    } else if (userWatchingCatMeme) {
      reject({
        name: "User watching cat meme",
        message: "Cat is better",
      });
    } else {
      resolve("Like and subscribe!!1");
    }
  });
}

//call the function with then() and catch() to handle what is returned
watchTutorialPromise()
  .then((message) => {
    console.log("Promise resolved, " + message);
  })
  .catch((error) => {
    console.log(error.name + " " + error.message); //error is the whole object that is returned
  });

//------------------------------------------------------------------------------------------------------------------------------
//How to use

const recordVideoOne = new Promise((resolve, reject) => {
  resolve("Video 1 recorded");
});
const recordVideoTwo = new Promise((resolve, reject) => {
  resolve("Video 2 recorded");
});
const recordVideoThree = new Promise((resolve, reject) => {
  resolve("Video 3 recorded");
});

//waits for all to complete and then resolves
Promise.all([recordVideoOne, recordVideoTwo, recordVideoThree]).then(
  (messages) => {
    //array returned with all promises (all run at the same time btw, one doesn't need to wait for other)
    console.log(messages);
  }
);

//waits for just one, and resolves fastes
Promise.race([recordVideoOne, recordVideoTwo, recordVideoThree]).then(
  (message) => {
    //single msg only
    console.log(message);
  }
);
