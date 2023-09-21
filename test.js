const http = require('http')
const url = require('url')


var adr = 'http://locsalhost:8000/default.html?year=2017&month=february';
var q = url.parse(adr,true)//true

// Using true as the second argument is
    // a convenient way to get the query parameters
    // in an easy-to-use object format rather than
    // parsing the query string manually.

console.log(q.path)
console.log(q.pathname)
console.log(q.search)
console.log(q.query)

// function getData(callback){
//     setTimeout(()=>{
//         let data = {name:"www.google"}
//         callback(data)
//     },2000)
// }

// function x(data){
//     console.log("data received",data.name)
// }

// getData(x)

let promise = ()=>{
    return new Promise((resolve,reject)=>{
        resolve("hello")

    })
}
console.log("first")
promise().then(()=>{
    console.log("data")

})
console.log("finish")
    
let promise2 = new Promise((resolve,reject)=>{
    let a = 2
    let b = 1
    if(a==b){
        resolve()
    }else{
        reject()
    }
})

.then(()=>{
    console.log("true")
}).catch(()=>{
    console.log("error")
})

let add = (a,b)=>{
    if(a==0){
        throw new Error("cannot add with zero")
    }
    return a+b
}

try{
    let result = add(5,5)
    console.log(result)
}catch(error){
    console.log(error.message)
}

async function collectData(){
   await promise()
   .then((data)=>{
    console.log("async f ", data)
   })
}
collectData()
console.log("final")