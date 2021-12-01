// setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');   // contex is like paper like we can draw on it using pen

const width = canvas.width = window.innerWidth;    //setting canvas width to cover viewport width
const height = canvas.height = window.innerHeight;  //setting canvas height to cover viewport height


// function to generate random number
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;    //gives number between min and max. 
  return num;
}




//Modelling a ball constructor since the object balls will all have these properties
function Ball(x, y, velX, velY, color, size){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
}
// Adding methods to constructor using prototype
//drawing the ball on the screen
Ball.prototype.draw = function(){
     // to state we want to draw a shape on ctx(paper)
    ctx.beginPath(); 
    // color of shape                                   
    ctx.fillStyle = this.color;     
    // we pass x,y and size. last two parameters specify the start and end numberof degrees around circle that the arc is drawn. here it is 0 and 360 ie 2PI.                     
    ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);    
    // fill the area with color we specified using fillStyle
    ctx.fill();
}
// updating ball's path when it touhces the canvas(screen) sides
// remember x, y are center coordinates of ball, and canvas(0,0) is at top left corner.
Ball.prototype.update = function() {
    // if center of ball + radius touches the right vertical wall of canvas
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }
    // if center of ball - radius of ball touches the left vertical wall 
    // if we dont substract radius the ball will change direction when center of ball touches wall
    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }
  
    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }
  
    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }
  
    this.x += this.velX;
    this.y += this.velY;
}
// Collision detection
Ball.prototype.collisionDetect = function(){
    for(let i=0; i<balls.length; i++){
        //if they are not the same balls
        if(!(this === balls[i])){
            const dx = this.x - balls[i].x;      // why const? why not let?
            const dy = this.y - balls[i].y;
            const distance = Math.sqrt(dx*dx+dy*dy);

            if(distance<=this.size+balls[i].size){
                this.color = balls[i].color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
            } //if
        }//if
    }//for
}//func





// Animating the ball
// Creating the balls 
let balls = [];
while(balls.length<10){ // creating 10 balls
        let size = random(10, 20); //declaring size before as we use it in placing the ball (x,y cooridinates below)

        let ball = new Ball(
             random(size, width-size),
             random(size, height-size),
             random(-10,10),
             random(-10,10),
             'rgb('+random(0, 255)+','+random(0, 255)+','+random(0, 255)+')',
             size);
        balls.push(ball);
}
// Animation loop
function loop() {
    //setting canvas fill color to semi-transparent black
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    //This serves to cover up the previous frame's drawing before the next one is drawn. If you don't do this, you'll just see long snakes worming their way around the canvas instead of balls moving! The color of the fill is set to semi-transparent rgba(0,0,0,0.25) in above line, to allow the previous few frames to shine through slightly, producing the little trails behind the balls as they move. If you changed 0.25 to 1, you won't see them at all any more.
    ctx.fillRect(0, 0, width, height);
    // Loops through all the balls in the balls array, and runs each ball's draw() and update() function to draw each one on the screen, then do the necessary updates to position and velocity in time for the next frame.
    for (let i = 0; i < balls.length; i++) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
    // Runs the function again using the requestAnimationFrame() method — when this method is repeatedly run and passed the same function name, it runs that function a set number of times per second to create a smooth animation. This is generally done recursively — which means that the function is calling itself every time it runs, so it runs over and over again.
    requestAnimationFrame(loop);
}
// calling the func to get the loop started
loop();

