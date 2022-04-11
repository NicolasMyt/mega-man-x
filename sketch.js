var Player;
var Ground;
var SensorGround;
var IsOnGround;
var PlayerMask;

//Setar o tamanho da tela.
var SCENE_W = 1600
var SCENE_Y = 800

var Dash = 0;
var DashTime = 0;
var DashLimit = 1;
var DashCount = 0;

var Player_Direction = 1;
var StopNormalAnimation = 0;
var Gravity = true;
var MaxSpeed = 1.5;
var LandSound = 0;


function preload(){

 //Carregar Animações
 XIdle = loadAnimation("XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle2.png","XSprites/Idle/XIdle3.png","XSprites/Idle/XIdle2.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle2.png","XSprites/Idle/XIdle3.png","XSprites/Idle/XIdle2.png","XSprites/Idle/XIdle1.png","XSprites/Idle/XIdle2.png","XSprites/Idle/XIdle3.png","XSprites/Idle/XIdle2.png");
 XIdle.frameDelay = 5

 XWalk = loadAnimation("XSprites/Walk/XWalk.png","XSprites/Walk/XWalk2.png","XSprites/Walk/XWalk3.png","XSprites/Walk/XWalk4.png","XSprites/Walk/XWalk5.png","XSprites/Walk/XWalk6.png","XSprites/Walk/XWalk7.png","XSprites/Walk/XWalk8.png","XSprites/Walk/XWalk9.png","XSprites/Walk/XWalk10.png")
 XWalk.frameDelay = 3

 XJump = loadAnimation("XSprites/Jump/XJump.png","XSprites/Jump/XJump2.png","XSprites/Jump/XJump3.png");
 XJump.looping = false;


 XFall = loadAnimation("XSprites/Falling/XFalling1.png","XSprites/Falling/XFalling2.png");
 XFall.looping = false;


 XDash = loadAnimation("XSprites/Dash/XDash1.png","XSprites/Dash/XDash2.png");
 XDash.looping = false;


 XLanding = loadAnimation("XSprites/Landing/XLanding1.png","XSprites/Landing/XLanding2.png");
 XWallSlide = loadAnimation("XSprites/WallSlide_&_Jump/XWallSlide1.png","XSprites/WallSlide_&_Jump/XWallSlide2.png");




 //Carregar Sons
 XJumpSound = loadSound("MegaManXSounds/XJump.ogg");
 XLandSound = loadSound("MegaManXSounds/XLand.ogg");
 XDashSound = loadSound("MegaManXSounds/XDash.ogg");

}

function setup() {

  noCursor();
  createCanvas(windowWidth - 6,windowHeight);

  frameRate(60);

  PlayerMask = createSprite(150,50,17,32);
  PlayerMask.shapeColor = "black"

  Player = createSprite(50,50,50,50);
  Player.setCollider("circle",0,-3,20);
  Player.addAnimation("Idle",XIdle);
  Player.addAnimation("Walking",XWalk);
  Player.addAnimation("Jump",XJump);
  Player.addAnimation("Fall",XFall);
  Player.addAnimation("Dash",XDash);
  
  

  SensorGround = createSprite(Player.x,Player.y,10,1);

  Ground = createSprite(250,200,500,10);

}

function draw() {
  background(100);
  

//Sensores
//Sensor de detecção se está no chão
  SensorGround.x = PlayerMask.x;
  SensorGround.y = floor(PlayerMask.y + 18);

  if(SensorGround.isTouching(Ground)){

  IsOnGround = true;


  if(LandSound == 0){
 
    XLandSound.play();
    LandSound = 1;
  }
}

  if(!SensorGround.isTouching(Ground)){

  IsOnGround = false;
  LandSound = 0;
  } 
  translate(0,0)
  //Gravidade
  if(PlayerMask.velocityY <= 5 && IsOnGround == false && Gravity == true){

    PlayerMask.velocityY = PlayerMask.velocityY + 0.25
  }


  //Fazer o Player se mover para a direita
  if(keyDown(RIGHT_ARROW)){
    PlayerMask.velocityX = MaxSpeed
    
    //Setar a direção que ele está olhando.
    if(DashTime <= 1){
      Player_Direction = 1;
    }

  }

  if(!keyDown(RIGHT_ARROW) && PlayerMask.velocityX > 0){
    PlayerMask.velocityX = 0
  }

  //Fazer o Player se mover para a Esquerda
  if(keyDown(LEFT_ARROW)){
    PlayerMask.velocityX = MaxSpeed *-1

    //Setar a direção que ele está olhando.
    if(DashTime <= 1){
      Player_Direction = -1;
    }
  }

  if(!keyDown(LEFT_ARROW) && PlayerMask.velocityX < 0){
    PlayerMask.velocityX = 0
  }

  

//Fazer o Player pular
  if(IsOnGround == true && keyDown("z")){
   XJumpSound.play();
   PlayerMask.velocityY = -5
  }


//Fazer o Player dar um Impulso
  if(DashTime == 0 && keyDown("c") && DashCount < DashLimit){
    DashTime = 30;
    XDashSound.play();

      if(Dash == 0 && IsOnGround == true){
        Dash = 1;
      }

      if(Dash == 0 && IsOnGround == false){
        DashCount = DashCount + 1;
        Dash = 2;
      }
  }

  if(DashTime > 1){
    DashTime -= 1

    Player.changeAnimation("Dash",XDash);
    StopNormalAnimation = 1;
    XDash.rewind()

    PlayerMask.velocityX = 3 * Player_Direction

    if(Dash == 2){ 
     Gravity = false;
     PlayerMask.velocityY = 0;
    }

  }

  if(!XJump.play){
    XJump.rewind(0);
    XJump.playing = false;
  }
  
  //Cancelar o impulso
  if(DashTime >= 1){

    if(!keyDown("c") && DashTime >= 1){
       DashTime = 0;
       Dash = 0;
    }

    if(Dash == 1 && IsOnGround == false){
      DashTime = -1;
      Dash = 0;
      Gravity = true;
      DashCount = DashCount + 1;
    }  
  }
  if(DashTime <= 1){

    Gravity = true;

    if(IsOnGround == true){
      DashCount = 0;
    }

    if(Dash == 2 && IsOnGround == false){
      DashTime = -1;
      Dash = 0;
    }

    if(StopNormalAnimation == 1){
      StopNormalAnimation = 0;
    }
  }

  if(DashTime == -1){
    MaxSpeed = 3

    if(IsOnGround == true){
    DashTime = 1;
    MaxSpeed = 1.5;
    }
  }
  

//Animações
  Player.x = PlayerMask.x
  Player.y = PlayerMask.y - 1
  if(StopNormalAnimation == 0){
    //Setar a posição do Sprite
  
       //Animações no Chão
         if(IsOnGround == true){
        //Parado
        if(PlayerMask.velocityX == 0){
          Player.changeAnimation("Idle",XIdle);
        }
        //Andando
        if(PlayerMask.velocityX != 0){
          Player.changeAnimation("Walking",XWalk);
          XWalk.rewind();
        }
      }
  
      //Animações no Ar
      if(IsOnGround == false){
       
        //Pulando
       if(PlayerMask.velocityY < 0){
         Player.changeAnimation("Jump",XJump);
         XJump.rewind();
       }
  
       
  
       //Caindo
       if(PlayerMask.velocityY >= 0){
       Player.changeAnimation("Fall",XFall);
       XFall.changeFrame();
       } 
     }
   }
  

  //Direção do Sprite
  if(Player_Direction == 1){
  Player.mirrorX(1);
  }

  if(Player_Direction == -1){
    Player.mirrorX(-1);
  }


  //Setar camera
  console.log(XJump.getFrame())
  PlayerMask.collide(Ground);
  drawSprites();

}
