"use strict"
const path = require('path');
const http = require('http');
const express = require('express');
const { env } = require('process');
const app = express();
const formatter = require("./dataExtractor.js");//unwrap the raw data
const satellite = require("satellite.js");//external lib
const util = require("util");
const axios = require("axios");
const PORT = 80 | process.env.PORT;
app.use(express.static(path.join(__dirname, "../client")));
app.get("/",(req, res) => {
    res.sendFile("/index.html");
});
const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
});
// const defaultOptions = {
//     hostname: "http://tle.ivanstanojevic.me/",
//     port: 80,
//     path: "/api/tle",
//     method: "GET"
// };
// const searchOptions = {
//     hostname: "http://tle.ivanstanojevic.me/",
//     port: 80,
//     path: `/api/tle?search=${search}`,
//     method: "GET"
// }
const io = require("socket.io")(httpServer);
io.on("connection", socket => {
    console.log(socket.id)
    socket.on("searchQuest", searchBundle => {
        axios.get(`http://tle.ivanstanojevic.me/api/tle?search=${searchBundle["searchName"]}`).then(response => {
            if(!response){
                io.to(searchBundle["ID"]).emit("err", null);
            }
            let l1 = formatter(response.data)[0].line1;
            let l2 = formatter(response.data)[0].line2;
            let satRec = satellite.twoline2satrec(l1, l2);
            //silly
            let posAndVelo = satellite.propagate(satRec, new Date());
            posAndVelo.velocity.x = Math.floor(posAndVelo.velocity.x);
            posAndVelo.velocity.y = Math.floor(posAndVelo.velocity.y);
            posAndVelo.velocity.z = Math.floor(posAndVelo.velocity.z);
            posAndVelo.position.x = Math.floor(posAndVelo.position.x);
            posAndVelo.position.y = Math.floor(posAndVelo.position.y);
            posAndVelo.position.z = Math.floor(posAndVelo.position.z);
            let res = {
                velocity: posAndVelo.velocity,
                position: posAndVelo.position,
            }
            io.to(searchBundle["ID"]).emit("calcData", res);
            searchBundle = null;
        }).catch(err=>{
            console.log(err)
            io.to(searchBundle.ID).emit("err", err);
        })
    })
})


//ES8 tryout
// async function test(){
    
// }

