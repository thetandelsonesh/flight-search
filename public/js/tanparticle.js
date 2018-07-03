//INIT
var background = "#000";
var color = "#fff";
var color_rgba = 255;
var radius = 20;
var web_radius = 100;
var velocity = 3;
var particle_count = 10;
var particles = [];

//init main canvas
var canvas = document.createElement('canvas');
canvas.setAttribute("id", "particleCanvas");
canvas.style.width = "100%";

var context = canvas.getContext('2d');

var body = document.getElementsByTagName("BODY")[0];
var div = document.createElement('div');
div.style.width = "100%";
div.style.zIndex = -1;
div.style.position = "absolute";
div.style.top = 0;
div.style.left = 0;
body.appendChild(div);
div.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//PARTICLE CLASS

var Particle = function(x, y, d, r) {
    this.r = r;
    this.x = x;
    this.y = y;
    this.d = {
        x: d.x,
        y: d.y
    };
    this.angle = 0;
    this.mag = 0;
    
    this.img = new Image();
    this.img.src = "http://localhost:3000/img/airplane.png";
    this.getd = function() {
        this.d.x = Math.random() * velocity  * ((Math.random() < 0.5) ? 1 : -1);
        this.d.y = Math.random() * velocity  * ((Math.random() < 0.5) ? 1 : -1);
    }

    this.draw = function() {
                
        // save the current co-ordinate system 
        // before we screw with it
        context.save();     
        // move to the middle of where we want to draw our image
        context.translate(this.x, this.y);    
        // rotate around that point, converting our 
        // angle from degrees to radians 
        context.rotate(this.angle);    
        // draw it up and to the left by half the width
        // and height of the image 
        context.drawImage(this.img, -(this.img.width/2), -(this.img.height/2),this.r*this.mag,this.r*this.mag);    
        // and restore the co-ords to how they were when we began
        context.restore(); 
    }

    this.move = function() {
        this.x += this.d.x;
        this.y += this.d.y;

        if (this.x <= (web_radius * -1) || this.x >= (canvas.width + web_radius) || this.y <= (web_radius * -1) || this.y >= (canvas.height + web_radius)) {
            this.x = parseInt(Math.random() * (canvas.width ));
            this.y = parseInt(Math.random() *( canvas.height));
            
            this.getd();

            if (Math.random() < 0.5) {
                (this.x < canvas.width / 2) ? this.x = 0 - web_radius: this.x = canvas.width + web_radius;
            } else {
                (this.y < canvas.height / 2) ? this.y = 0 - web_radius: this.y = canvas.height + web_radius;
            }

            this.r = 10 + parseInt(Math.random() * radius);
            this.mag = 1 + Math.sqrt((this.d.x*this.d.x) + (this.d.y*this.d.y));      
            var angle = Math.atan2(this.d.y,this.d.x);
            angle = angle * 180 / Math.PI;
            angle = 90 + angle;
            this.angle = angle * Math.PI/180 ;
        }
    }

}

function drawParticles() {
    context.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
    for (var i = 0; i < particle_count; i++) {
        particles[i].move();
        particles[i].draw();
    }
    requestAnimationFrame(drawParticles);
}

function startAnimation() {
    for (var i = 0; i < particle_count; i++) {

        //initialize with random value
        var x = -10* web_radius;// parseInt(Math.random() * canvas.width);
        var y = -10* web_radius;// parseInt(Math.random() * canvas.height);
        var r = 10 + parseInt(Math.random() * radius);
        var d = {
            x: 0,
            y: 0
        };
        while (d.x == 0 && d.y == 0) {
            d.x = parseInt(Math.random() * velocity) * ((Math.random() < 0.5) ? 1 : -1);
            d.y = parseInt(Math.random() * velocity) * ((Math.random() < 0.5) ? 1 : -1);
        }

        var p = new Particle(x, y, d, r);
        particles.push(p);
    }
    drawParticles();
}

function resizeit() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}