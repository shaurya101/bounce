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





// Modelling a Shape constructor to be inherited by Ball and EvilBall
function Shape(x, y, velX, velY, exists){
  this.x = x;             // x coordinate
  this.y = y;             // y coordinate
  this.velX = velX;       // x velocity
  this.velY = velY;       // y velocity
  this.exists = exists;   // exists true or false
}
// Adding methods to constructor using prototype
// Drawing the ball on the screen
Shape.prototype.draw = function(){
  // to state we want to draw a shape on ctx(paper)
 ctx.beginPath(); 
 // color of shape                                   
 ctx.fillStyle = this.color;     
 // we pass x,y and size. last two parameters specify the start and end numberof degrees around circle that the arc is drawn. here it is 0 and 360 ie 2PI.                     
 ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);    
 // fill the area with color we specified using fillStyle
 ctx.fill();
}






//Modelling a ball constructor since the object balls will all have these properties
function Ball(x, y, velX, velY, color, size, exists){
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
}
// Inheriting Shape's methods to Ball. Won't need this if inheriting only proprties of Shape and not the methods. 
Ball.prototype=Object.create(Shape.prototype);
// But now Ball.prototype.constructor=Shape() instead of Ball(). To correct this-
Object.defineProperty(Ball.prototype, 'constructor',
  {
    value: Ball,
    enumerable: false,
    writable: true
  }
);
// Now adding more methods to Ball.prototype
// updating ball's path when it touhces the canvas(screen) sides
// remember x, y are center coordinates of ball, and canvas(0,0) is at top left corner.
Ball.prototype.update = function() {
    // if center of ball + radius touches the right vertical wall of canvas
    if ((this.x + this.size) >= width) {     // right vertical
      this.velX = -(this.velX);
    }
    // if center of ball - radius of ball touches the left vertical wall 
    // if we dont substract radius the ball will change direction when center of ball touches wall
    if ((this.x - this.size) <= 0) {         // left vertical
      this.velX = -(this.velX);
    }
  
    if ((this.y + this.size) >= height) {     // top horizontal
      this.velY = -(this.velY);
    }
  
    if ((this.y - this.size) <= 0) {          // bottom horizontal
      this.velY = -(this.velY);
    }
  
    this.x += this.velX;
    this.y += this.velY;
}
// Collision detection
Ball.prototype.collisionDetect = function(){
    for(let i=0; i<balls.length; i++){
        //if they are not the same balls
        if(!(this === balls[i]) && balls[i].exists){
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
             random(size, width-size),                                             // x coordinate
             random(size, height-size),                                            // y coordinate
             random(-10,10),                                                       // velX
             random(-10,10),                                                       // velY
             'rgb('+random(0, 255)+','+random(0, 255)+','+random(0, 255)+')',      // color
             size,                                                                 // size
             true);                                                                // exists=true
        balls.push(ball);
}





// Modelling EvilCircle
function EvilCircle(x, y, velX, velY, color, size, exists){
  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size;
}
EvilCircle.prototype.draw = function(){    // we can have the same name function as EvilCircle as we did not inhert Shape's methods into it
  ctx.beginPath(); 
  ctx.strokeStyle = this.color; 
  ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);  
  ctx.stroke();
}
EvilCircle.prototype.update = function(){
  // if center of ball + radius touches the right vertical wall of canvas
  if ((this.x + this.size) >= width) {
    this.x -= this.size;
  }
  // if center of ball - radius of ball touches the left vertical wall 
  // if we dont substract radius the ball will change direction when center of ball touches wall
  if ((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if ((this.y + this.size) >= height) {   // top horizontal
    this.y -= this.size;
  }

  if ((this.y - this.size) <= 0) {        // bottom horizontal
    this.y += this.size;
  }
}
EvilCircle.prototype.setControls = function(){
  let _this = this;                              // why needed? Due to some function scope apparently
  window.onkeydown = function(e) {
    if (e.key === 'a') {
      _this.x -= _this.velX;
    } else if (e.key === 'd') {
      _this.x += _this.velX;
    } else if (e.key === 'w') {
      _this.y -= _this.velY;
    } else if (e.key === 's') {
      _this.y += _this.velY;
    }
  }
}
EvilCircle.prototype.collisionDetect = function(){
  for(let i=0; i<balls.length; i++){
      //if they are not the same balls
      if(balls[i].exists){
          const dx = this.x - balls[i].x;      // why const? why not let?
          const dy = this.y - balls[i].y;
          const distance = Math.sqrt(dx*dx+dy*dy);

          if(distance<=this.size+balls[i].size){
              balls[i].exists = false;
          } //if
      }//if
  }//for
}//func
let EvilBall = new EvilCircle(25, 25, 10, 10, 'rgb(255, 255, 255)', 25, true);
EvilBall.setControls();




// Animation loop
function loop() {
  //setting canvas fill color to semi-transparent black
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  //This serves to cover up the previous frame's drawing before the next one is drawn. If you don't do this, you'll just see long snakes worming their way around the canvas instead of balls moving! The color of the fill is set to semi-transparent rgba(0,0,0,0.25) in above line, to allow the previous few frames to shine through slightly, producing the little trails behind the balls as they move. If you changed 0.25 to 1, you won't see them at all any more.
  ctx.fillRect(0, 0, width, height);
  // Loops through all the balls in the balls array, and runs each ball's draw() and update() function to draw each one on the screen, then do the necessary updates to position and velocity in time for the next frame.
  for (let i = 0; i < balls.length; i++) {
    if(balls[i].exists){
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

  EvilBall.draw();
  EvilBall.update();
  EvilBall.collisionDetect();

  // Runs the function again using the requestAnimationFrame() method — when this method is repeatedly run and passed the same function name, it runs that function a set number of times per second to create a smooth animation. This is generally done recursively — which means that the function is calling itself every time it runs, so it runs over and over again.
  requestAnimationFrame(loop);
}
// calling the func to get the loop started
loop();
