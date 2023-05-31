const canvas=document.getElementById('canvas');
var context=canvas.getContext('2d');

canvas.height=window.innerHeight*0.9;
canvas.width=window.innerWidth*0.6;
var x=canvas.width/2-50;
var y=canvas.height-90;
speed=3;
dx=0;
dy=0;
const homeX = 350;
const homeY = 300;
const shoot=new Audio();
shoot.src='shoot.wav'
var homeImage = new Image();
homeImage.src = 'home.png';
var score=0;
var rot=0;
var dr=0;
var maxHomeHealth=10;
var homeHealth=10;
var maxPlayerHealth=10;
var playerHealth=10;
var blast= new Image();
blast.src='blast.png';
const mouse={
  x:0,
  y:0
}


var ship=new Image();
ship.src='ship.png';
var bullets=[];
var bots=[];
var keys={};
let isFiring = false;
let firingInterval;
var gameStatus=0;
document.addEventListener('keydown',function(e){
  if (e.key=='Enter'){
    var a=document.getElementById('#start');
    a.style.visibility='hidden';
    var b=document.querySelectorAll('#bg');
    b[0].style.filter='blur(0px)';
    gameStatus=1;
    intializeGame();
  }
})
function intializeGame(){
  setInterval(function(){
    if (bots.length<5){
        createBot();
    }
},200)
function update(){
  if (gameStatus==1){
    context.clearRect(0,0,canvas.width,canvas.height);
    context.drawImage(homeImage, homeX, homeY, 200,300);
    context.font='26px Arial';
    context.fillStyle='white';
    context.fillText(`Score: ${score}`,canvas.width-150,100);
    context.font='20px Arial';
    context.fillStyle='white';
    context.fillText(`Home Health`,180,35);
    context.font='20px Arial';
    context.fillStyle='white';
    context.fillText(`Player Health`,180,66);
    if (keys['Arrowleft']){
        x-=speed;
    }
    
    if (keys['Arrowright']){
        x+=speed;
    }
    if (keys[' ']) {
        if (!isFiring) {
          isFiring = true;
          createBullet();
          
          firingInterval = setInterval(createBullet, 500);
        }
      } else {
        if (isFiring) {
          isFiring = false;
          clearInterval(firingInterval);
        }
      }
    if (keys['a']){
      if (rot>-1){
        rot-=0.02;
      }
    }
    if (keys['d']){
      if (rot<1){
        rot+=0.02;
      }
    }
  
    if (x<90){
        x=90;
    }
    
    if (x>canvas.width-90){
        x=canvas.width-90;
    }
    

    drawRotatedImage(ship,x,y,rot);
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        context.drawImage(bullet.image, bullet.x, bullet.y, bullet.width, bullet.height);
      }
      for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        bullet.y -= bullet.speed; 
        bullet.x+= Math.tan(bullet.angle)*bullet.speed;
    
        
        if (bullet.y + bullet.height < 0) {
          bullets.splice(i, 1);
          i--;
        }
      }
    for (let i = 0; i < bots.length; i++) {
        const bot = bots[i];
        context.drawImage(bot.image, bot.x, bot.y, bot.width, bot.height);
      }
      for (let i = 0; i < bots.length; i++) {
        const bot = bots[i];
        bot.y += bot.speed; 
        if (bot.y + bot.height > canvas.height) {
          bots.splice(i, 1);
          i--;
        }
      }
      if (homeHealth>8){
      context.fillStyle = 'green';
      }
      else if(homeHealth>5){
        context.fillStyle = 'yellow';
      }
      else if (homeHealth>2){
        context.fillStyle = 'orange';
      }
      else {
        context.fillStyle = 'red';
      }
      context.fillRect(
        20,
        20,
        150 * (homeHealth / maxHomeHealth), 
        20
      );
      if (playerHealth>8){
        context.fillStyle = 'green';
        }
        else if(playerHealth>5){
          context.fillStyle = 'yellow';
        }
        else if (playerHealth>2){
          context.fillStyle = 'orange';
        }
        else {
          context.fillStyle = 'red';
        }
        context.fillRect(
          20,
          50,
          150 * (playerHealth / maxPlayerHealth), 
          20
        );
    collisionDetection();
    collisionDetectionHome();
    collisionDetectionPlayer(x,y);
    document.addEventListener('keydown',keydown);
    document.addEventListener('keyup',keyup);
    if (playerHealth==0 || homeHealth==0){
      gameStatus=0;
      var b=document.querySelectorAll('#bg');
      b[0].style.filter='blur(5px)';
      var c=document.querySelector('.end');
      c.style.visibility='visible';
      var text=document.querySelector('.score-tag');
      text.innerHTML+=`Your Score is ${score}`;
      console.log(text);
      var button=document.querySelector('.button');
      button.addEventListener('click',function(){
        window.location.reload();
      })
    }
    requestAnimationFrame(update);
  }
    
}
function keydown(e){
    
    if (e.key=='ArrowLeft'){
        keys['Arrowleft']=true;
    }
    if(e.key=='ArrowRight'){
        keys['Arrowright']=true;
    }
    if (e.key==' '){
        keys[' ']=true;
    }
    if (e.key=='a'){
        keys['a']=true;
    }
    if (e.key=='d'){
        keys['d']=true;
    }
    if (e.key=='Escape'){
      gameStatus=0;
    }
    if (e.key=='Enter'){
      gameStatus=1;
    }
}
function keyup(e){
    if (e.key=='ArrowLeft'){
        keys['Arrowleft']=false;
    }
    if(e.key=='ArrowRight'){
        keys['Arrowright']=false;
    }
    if (e.key==' '){
        keys[' ']=false;
    }
    if (e.key=='a'){
      keys['a']=false;
    }
    if (e.key=='d'){
      keys['d']=false;
    }
}
function createBullet() {
    const bullet = {
      x: x-10, 
      y: y,
      width: 20, 
      height: 20, 
      speed: 6, 
      angle:rot,
      image: new Image() 
    };
    bullet.image.src = 'Bullet.png'; 
    bullets.push(bullet); 
  }
function createBot() {
    let a=Math.random()*(canvas.width*0.7)+canvas.width*0.1;
    const bot = {
      x: a, 
      y: 0,
      width: 50, 
      height: 50, 
      speed: 5, 
      image: new Image() 
    };
    bot.image.src = 'Enemy.png'; 
    bots.push(bot); 
  }
  function collisionDetection() {
    for (let i = 0; i < bullets.length; i++) {
      const bullet = bullets[i];
      for (let j = 0; j < bots.length; j++) {
        const bot = bots[j];
        if (bullet.x < bot.x + bot.width &&
            bullet.x + bullet.width > bot.x &&
            bullet.y < bot.y + bot.height &&
            bullet.y + bullet.height > bot.y) {
          bullets.splice(i, 1);
          i--;
          bots.splice(j, 1);
          j--;
          score+=5;
          context.drawImage(blast, bot.x, bot.y, bot.width, bot.height);
        }
      }
    }
    
    
  }
  function collisionDetectionHome() {
    for (let i = 0; i < bots.length; i++) {
      const bot = bots[i];
      if (
        homeX+30< bot.x + bot.width &&
        homeX+150> bot.x &&
        homeY+100< bot.y + bot.height &&
        homeY+100> bot.y
      ) {
        bots.splice(i,1);
        i--;
        score-=10;
        homeHealth--;
        context.drawImage(blast, bot.x, bot.y, bot.width, bot.height);
      }
    }
  }
  function collisionDetectionPlayer(x,y) {
    for (let i = 0; i < bots.length; i++) {
      const bot = bots[i];
      if (
        x-50< bot.x + bot.width &&
        x+50> bot.x &&
        y -50< bot.y + bot.height &&
        y > bot.y
      ) {
        bots.splice(i,1);
        i--;
        score-=10;
        playerHealth--;
        context.drawImage(blast, bot.x, bot.y, bot.width, bot.height);
      }
    }
  }
  function drawRotatedImage(image, x, y, angle)
{ 
    context.save(); 
    context.translate(x, y);
    context.rotate(angle);
    context.drawImage(image, -(image.width/2), -(image.height/2));
    context.restore(); 
}
update();
}
