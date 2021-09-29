"use strict"
module.exports = function formatter(raw){
    const members = raw["member"];//Array 
    const res = new Object();
    let counter = 0;
    for(let member of members){
        let temp = {
            ID: member["satelliteId"],
            Name: member["name"],
            Date: member["date"],
            line1: member["line1"],
            line2: member["line2"]
        }
        res[counter] = temp;
        counter++;
    }
    return res;
};


