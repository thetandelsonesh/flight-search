var url = "http://localhost:3000/";

function ajax(method,url,cb){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(null,this.responseText);
        }else{
            cb(true,null);
        }
    };
    xhttp.open(method, url, true);
    xhttp.send();
}

function validateField(obj){
    if(obj){
        if(obj.value){
            obj.style.border = "1px solid #ccc";
            return true;
        }else{
            obj.style.border = "2px solid #d50000";
            return false;
        }
    }else{
        var bookingtype = document.forms["search-form"]["bookingtype"];
        if(bookingtype.value){
            document.getElementById("toggler").style.border = "1px solid #ccc";
            if(bookingtype.value == 1){
                document.forms["search-form"]["returndate"].value = "21-01-2018";
                document.forms["search-form"]["returndate"].style.display = "none";
            }else{
                document.forms["search-form"]["returndate"].style.display = "block";
            }
            return true;
        }else{
            document.getElementById("toggler").style.border = "2px solid #d50000";
            return false;
        }
    }
}


function getTemplateResult(data, obj){
    obj.departure = new Date(obj.departure);
    obj.departure = obj.departure.toLocaleDateString("en-US",{hour:"2-digit", minute:"2-digit", second:"2-digit"});
    obj.arrival = new Date(obj.arrival);   
    obj.arrival =obj.arrival.toLocaleDateString("en-US",{hour:"2-digit", minute:"2-digit", second:"2-digit"});

    var departDetails = `<p>AI-${obj.airlineCode}</p>
                        <h3>${obj.origin} > ${obj.destination}</h3>
                        <p>Depart : ${obj.departure}</p>
                        <p>Arrive : ${obj.arrival}</p>`;
    var returnDetails = data.bookingtype == 2 ? `<p>AI-${obj.airlineCode}</p>
                        <h3>${obj.destination} > ${obj.origin}</h3>
                        <p>Depart : ${obj.departure}</p>
                        <p>Arrive : ${obj.arrival}</p>`: ``;

    return `<div class="row container-box">
                <div class="col-50">
                    <div class="row">
                        <div class="col-fix-50 ">${departDetails}</div>
                        <div class="col-fix-50 pull-right">${returnDetails}</div>
                    </div>
                </div>
                <div class="col-50 pull-center">
                    <div class="row">
                    <div class="col-50"><h2>₹${obj.price}</h2></div>
                    <div class="col-50"><button>BOOK</button></div>
                    </div>
                </div>
            </div>`;
}

function getFormValues(){
    var form = document.forms["search-form"];
    var validity =  validateField(form["origin"])
    && validateField(form["dest"])
    && validateField(form["passanger"])
    && validateField()
    && validateField(form["departdate"])
    &&(form["bookingtype"].value == 1 || validateField(form["returndate"]));
 
    if(!validity){
        return;
    }

    var formData = {
        origin : form["origin"].value,
        dest : form["dest"].value,
        passanger : form["passanger"].value,
        bookingtype : form["bookingtype"].value,
        departdata : form["departdate"].value,
        returndate : form["returndate"].value,
    }

    ajax("GET", url + "getFlightData", function(err, res){

        document.getElementsByClassName("result-container")[0].style.display = "block";
        document.getElementById("origin-result").innerHTML = formData.origin;
        document.getElementById("dest-result").innerHTML = formData.dest;
        document.getElementById("depart-result").innerHTML = "Departure : " + formData.departdata;
        document.getElementById("return-result").innerHTML = formData.bookingtype == 2 ? "Return : " + formData.returndate : "";
        document.getElementById("bookingtype").src = formData.bookingtype == 1 ? "img/oneway.png" : "img/return.png";
        
        if(!err){
            var resData = JSON.parse(res);
            var dataHTML = ""
            for(var i=0; i<resData.length;i++){
                dataHTML += getTemplateResult(formData,resData[i]);
            }
            document.getElementById("container-box-dump").innerHTML =dataHTML;
        }
    })
}
