const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')



app.get("/totalRecovered", async(req,res)=>{
    let result=await connection.aggergate([{
        $group:{
            _id:"$id",
            recovered:{$sum:"$recovered"}
        }
    }])
    res.send(result)
})


app.get("/totalActive", async(req,res)=>{
    let result=await connection.aggergate([{
        $group:{
            _id:"$id",
            active:{$subtract:["$infectwd","$recovered"]}
        }
    }])
    res.send(result)
})

app.get("/totalDeath", async(req,res)=>{
    let result=await connection.aggergate([{
        $group:{
            _id:"$id",
            totaldeath:{$sum:"$daeth"}
        }
    }])
    res.send(result)
})

app.get("/hotspotStates", async(req,res)=>{
    let result=await connection.aggergate([{
        $project:{
            state:'$state',
            rate:{
                $cond:{
                    if:{
                        $gte:[
                            { 
                                $round:[{$divide:[{$subtract:['infected', 'recovered']},'$infected']},5]},0.1]
                    }, then:null,else:"hotspotState"
                }
            }
        }
    }])
    res.send(result)
})


app.get("/hotspotStates", async(req,res)=>{
    let result=await connection.aggergate([{
        $project:{
            state:'$state',
            rate:{
                $cond:{
                    if:{
                        $gte:[
                            { 
                                $round:[{$divide:[{$subtract:['infected', 'recovered']},'$infected']},5]},0.005]
                    }, then:null,else:"healthyState"
                }
            }
        }
    }])
    res.send(result)
})


app.listen(port,()=>{
    console.log(`App listening on port ${port}`)
})







module.exports = app;