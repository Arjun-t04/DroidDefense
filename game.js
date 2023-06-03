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
var shoot=new Audio('bullet.mp3');
shoot.src='bullet.mp3'
const enemybullet=new Audio();
enemybullet.src='enemybullet.wav';
var powerup1=new Image();
powerup1.src='powerup1.png'
var powerup2=new Image();
powerup2.src='powerup2.png'
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
var blastsound= new Audio();
var playerhit=new Audio();
var homehit=new Audio();
var bgmusic=new Audio();
var hit=new Audio();
var powerup1sound=new Audio();
powerup1sound.src='powerup1sound.wav'
hit.src='Hit.wav';
var gameover=new Audio();
gameover.src='Gameover.wav'
var time=bgmusic.duration;
bgmusic.src='bgmusic.mp3';
homehit.src='audio.wav';
playerhit.src='home_hit.wav';
blastsound.src='blast.mp3';
blast.src='blast.png';
const mouse={
  x:0,
  y:0
}


var playername=document.getElementById('name');
var powerup2sound=new Audio();
powerup2sound.src='powerup2sound.mp3'
var ship=new Image();
ship.src='ship.png';
var bulletImage=new Image();
bulletImage.src='Enemy bullet.png';
var bullets=[];
var enemyBullets=[];
var blastpowerups=[];
var healpowerups=[];
var bots=[];
var keys={};
let isFiring = false;
let firingInterval;
var gameStatus=0;
var play=document.getElementById("play");
play.addEventListener('click',function(){
      
      var a=document.getElementById('#start');
      a.style.visibility='hidden';
      var b=document.querySelectorAll('#bg');
      b[0].style.filter='blur(0px)';
      gameStatus=1;
      intializeGame();
  })

function intializeGame(){
  
  setInterval(function(){
    if (bots.length<5){
        createBot();
    }
},400)
setInterval(createHealPowerUp,17000)
setInterval(createBlastPowerUp,13000);
setInterval(createEnemyBullets, 5000);
function update(){
  var name1=playername.value;
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
    if (keys['Arrowup']){
      y-=speed;
  }
  
  if (keys['Arrowdown']){
      y+=speed;
  }
    if (keys[' ']) {
        if (!isFiring) {
          isFiring = true;
          createBullet();
          firingInterval = setInterval(createBullet, 300);
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
    if (y<90){
      y=90;
  }
    
    if (x>canvas.width-90){
        x=canvas.width-90;
    }
    if (y>canvas.height-90){
      y=canvas.height-90;
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
        const angle = calculateAngle(bot.x-60, bot.y-100, homeX, homeY);
        
        context.save();
        context.translate(bot.x + bot.width / 2, bot.y + bot.height / 2);
        context.rotate(angle * Math.PI / 180);
        context.drawImage(bot.image, -bot.width / 2, -bot.height / 2, bot.width, bot.height);
        context.restore();
      }
      for (let i = 0; i < bots.length; i++) {
        const bot = bots[i];
        bot.y += bot.speed; 
        if (bot.y + bot.height > canvas.height) {
          bots.splice(i, 1);
          i--;
          score-=5;
        }
      }
      for (let i=0; i<blastpowerups.length;i++){
        const blastpowerup=blastpowerups[i];
        context.drawImage(powerup1,blastpowerup.x,blastpowerup.y,50,50);
        blastpowerup.y+=blastpowerup.speed;
        if (blastpowerup.y + blastpowerup.height > canvas.height) {
          blastpowerups.splice(i, 1);
          i--;
        }
        
        
        if (Math.abs(x-blastpowerup.x)<50 && Math.abs(y-blastpowerup.y)<50){
          blastpowerups.splice(i, 1);
          i--;
          for (let i = 0; i < bots.length; i++) {
            const bot=bots[i];
            bots.splice(i,1);
            i--;
            showBlast(bot.x, bot.y, bot.width, bot.height); 
            powerup1sound.play();
          }
        }
      }
      for (let i=0; i<healpowerups.length;i++){
        const healpowerup=healpowerups[i];
        context.drawImage(powerup2,healpowerup.x,healpowerup.y,50,50);
        healpowerup.y+=healpowerup.speed;
        if (healpowerup.y + healpowerup.height > canvas.height) {
          healpowerups.splice(i, 1);
          i--;
        }
        
        
        if (Math.abs(x-healpowerup.x)<50 && Math.abs(y-healpowerup.y)<50){
          healpowerups.splice(i, 1);
          i--;
          playerHealth+=2;
          homeHealth+=2;
          powerup2sound.play();
          if (playerHealth>10){
            playerHealth=10;
          }
          if (homeHealth>10){
            homeHealth=10;
          }
        }
      }
      for (let i = 0; i < enemyBullets.length; i++) {
        const bullet = enemyBullets[i];
        context.save();
        context.translate(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2);
        context.rotate(bullet.angle * (Math.PI / 180));
        context.drawImage(bulletImage, -bullet.width / 2, -bullet.height / 2, bullet.width, bullet.height);
        context.restore();
  
        bullet.x -= Math.sin((bullet.angle * Math.PI) / 180) * bullet.speed;
        bullet.y += Math.cos((bullet.angle * Math.PI) / 180) * bullet.speed;
  
        if (bullet.y + bullet.height < 0) {
          enemyBullets.splice(i, 1);
          i--;
        }
        if (checkCollision(bullet, homeX+60, homeY+100, 200, 200)) {
          enemyBullets.splice(i, 1);
          i--;
          showBlast(bullet.x, bullet.y, 30, 30); 
          homeHealth-=0.25;
          enemybullet.play();
        }
        if (checkCollision(bullet, x-30, y-50, 200, 200)) {
          enemyBullets.splice(i, 1);
          i--;
          showBlast(bullet.x, bullet.y, 30, 30); 
          playerHealth-=0.5;
          enemybullet.play();
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
    if (playerHealth<=0 || homeHealth<=0){
      gameStatus=0;
      shoot=new Audio();
      gameover.play();
      localStorage.setItem(name1,score);
      const items={...localStorage};
            const elements=Object.entries(items);

            elements.forEach(k=>{
                    elements.splice(elements.indexOf(k),1);
            });
            for(var i = 0; i < elements.length; i++) {
                for(var j=0; j < elements.length; j++) {
                    if(Number(elements[i][1]) > Number(elements[j][1])) {
                        var temp = elements[i];
                        elements[i] = elements[j];
                        elements[j] = temp;        
                    }
                }
            }
            let leaderboard=document.getElementById('leaderboard');
            leaderboard.innerHTML='Leaderboard:<br>';
            let index=1;
            for (k of elements){
                leaderboard.innerHTML+=`${index}. ${k[0]}: ${k[1]}<br>`;
                index+=1;
            }
      var b=document.querySelectorAll('#bg');
      b[0].style.filter='blur(5px)';
      var c=document.querySelector('.end');
      c.style.visibility='visible';
      var text=document.querySelector('.score-tag');
      text.innerHTML+=`Your Score is ${score}`;
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
    if (e.key=='ArrowUp'){
      keys['Arrowup']=true;
  }
  if(e.key=='ArrowDown'){
      keys['Arrowdown']=true;
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
    if (e.key=='ArrowUp'){
      keys['Arrowup']=false;
  }
  if(e.key=='ArrowDown'){
      keys['Arrowdown']=false;
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
      speed: 10, 
      angle:rot,
      image: new Image() 
    };
    bullet.image.src = 'Bullet.png'; 
    bullets.push(bullet); 
    shoot.play();
  }
function createBot() {
    let a=Math.random()*(canvas.width*0.7)+canvas.width*0.1;
    const bot = {
      x: a, 
      y: 0,
      width: 50, 
      height: 50, 
      speed: 0.3, 
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
          if (j<bots.length){
            bullets.splice(i, 1);
            i--;
            bots.splice(j, 1);
            j--;
            score+=5;
            showBlast(bot.x, bot.y, bot.width, bot.height); 
            hit.play();
            setTimeout(() => {
              removeBlast();
            }, 1000);
          }
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
        showBlast(bot.x, bot.y, bot.width, bot.height); 
        homehit.play();
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
        showBlast(bot.x, bot.y, bot.width, bot.height); 
        playerhit.play();
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
function showBlast(x, y, width, height) {
  context.drawImage(blast, x, y, width, height);
}

function removeBlast() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}
function calculateAngle(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return (Math.atan2(dy, dx) * 180) / Math.PI - 90;
}
function createEnemyBullets() {
  for (let i = 0; i < bots.length; i++) {
    const bot = bots[i];
    const angle = calculateAngle(bot.x-60, bot.y-100, homeX, homeY);
    const bullet = {
      x: bot.x + bot.width / 2,
      y: bot.y + bot.height / 2,
      width: 10,
      height: 10,
      speed: 2,
      angle,
    };
    enemyBullets.push(bullet);
  }
}
function checkCollision(bullet, targetX, targetY, targetWidth, targetHeight) {
  return (
    bullet.x < targetX + targetWidth &&
    bullet.x + bullet.width > targetX &&
    bullet.y < targetY + targetHeight &&
    bullet.y + bullet.height > targetY
  )
}
function createBlastPowerUp() {
  let blastpowerup = {
    x: Math.random() * (canvas.width - 100)+50,
    y: -50,
    image: powerup1,
    speed:0.5
  };
  blastpowerups.push(blastpowerup);
}
function createHealPowerUp() {
  let healpowerup = {
    x: Math.random() * (canvas.width - 100)+50,
    y: -50,
    image: powerup2,
    speed:0.5
  };
  healpowerups.push(healpowerup);
}


update();
}
