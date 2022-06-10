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
Great for when you want to do something that is going to take a long time - download img from server and do something after it is completed
Promises are meant to replace callbacks. Lot easier.
*/

let userLeft = false;
let userWatchingCatMeme = true;

//define function that returns a promsise
function watchTutorialPromise() {
  return new Promise((resolve, reject) => {
    if (userLeft) {
      reject("User Left :(");
    } else if (userWatchingCatMeme) {
      reject("User watching cat vids :/");
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
  .catch((message) => {
    console.log("Promise rejected, " + message);
  });
