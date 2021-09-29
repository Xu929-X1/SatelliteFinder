"use strict"
const socket = io();
window.addEventListener("load", () => {
    socket.on("connect", () => {
        console.log(socket.id);
    });
    const satelliteInputBox = document.querySelector("input");
    satelliteInputBox.addEventListener("keyup", e => {
        if (e.key == "Enter" || e.keyCode == 13) {
            let name = satelliteInputBox.value;
            socket.emit("searchQuest", {
                searchName: name,
                ID: socket.id
            })
        }
    })
    socket.on("calcData", data => {
        console.log(data)
        if (!isNaN(data.position.x)) {
            let table = document.getElementById("table");
            table.style.border = "1px solid black";
            table.style.color = "#FFF";
            let name = document.createElement("tr");
            table.appendChild(name);
            name.innerHTML = satelliteInputBox.value;
            for(let part in data){
                for(let details in data[part]){
                    let temp = name.insertCell(0);
                    temp.innerHTML = data[part][details];
                }
            }
        } else {
            console.log("invalid search");
        }
    })
    socket.on("err", err=>{
        console.log("Invalid Search")
    })
})