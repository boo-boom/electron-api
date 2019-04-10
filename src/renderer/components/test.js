// new Promise((resolve,reject)=>{
//   console.log("promise1")
//   resolve()
// }).then(()=>{
//     console.log("then11")
//     new Promise((resolve,reject)=>{
//         console.log("promise2")
//         resolve()
//     }).then(()=>{
//         console.log("then21")
//     }).then(()=>{
//         console.log("then23")
//     })
// }).then(()=>{
//     console.log("then12")
// })

async function async1() {
  console.log("async1 start");
  await  async2();
  console.log("async1 end");
}

async  function async2() {
  console.log( 'async2');
}

console.log("script start");

setTimeout(function () {
  console.log("settimeout");
},0);

async1();

new Promise(function (resolve) {
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("promise2");
});
console.log('script end');

// script start => async1 start => async2 => promise1 => async1 end => script end => promise2 => settimeout
