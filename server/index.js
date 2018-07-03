let express = require("express");
let fs = require("fs");

let app = express();

app.use(express.static('public'));

app.listen(3000,function(){
    console.log("Server running http://localhost:3000");
})

app.get("/getFlightData",function(req,res){
    fs.readFile(process.cwd()+"/server/files/flightData.json", function(err, data){
        if(err) throw err;    
        res.send(data);
    });
})