// const mongoose=require('mongoose')


// const url=process.env.MONGODB_URL

// mongoose.connect(url,{
//     useNewUrlParser:true,
//     // UseCreateIndex:true
// })


const mongoose = require("mongoose")

 

async function dbConnection(){

    try {

        await mongoose.connect(process.env.MONGODB_URL, {

            useNewUrlParser:true,

        })

        // console.log("connected to db...");

    } catch (error) {

        console.log(error);

    }

}

 

module.exports = dbConnection