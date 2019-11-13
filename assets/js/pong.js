var Pong = {};

Pong.display = function() {
  const pongStage = document.createElement("canvas");
  pongStage.id = "pong-stage";
  pongStage.setAttribute("width", 600);
  pongStage.setAttribute("height", 400);
  document.body.appendChild(pongStage);
  document.querySelector("#logo").classList.add("pong");

  const onKeyUp = e => {
    if (e.keyCode == 27) {
      document.removeEventListener("keyup", onKeyUp);
      Pong.hide();
    }
  };
  document.addEventListener("keyup", onKeyUp);

  document.querySelector("#logo").addEventListener("animationend", function() {
    if (document.querySelector("#logo").classList.contains("pong")) {
      document.querySelector("#pong-stage").classList.add("active");
      Pong.init();
    }
  });
};

Pong.hide = function() {
  var topMargin = 22;
  Pong.stage.removeChild(
    Pong.escText,
    Pong.cpuScoreText,
    Pong.playerScoreText,
    Pong.gameOverText,
    Pong.msgText
  );

  for (var i = 0; i < Pong.balls.length; i++) {
    createjs.Tween.get(Pong.balls[i])
      .wait(100)
      .to({ y: 62 }, 500, createjs.Ease.quartInOut);
  }
  //outro
  Pong.stage.off("stagemousemove", Pong.movePaddle);
  createjs.Ticker.removeEventListener("tick", Pong.tick);
  if (Pong.ball) {
    Pong.stage.removeChild(Pong.ball);
  }
  if (Pong.msgText) {
    Pong.stage.removeChild(Pong.msgText);
  }
  createjs.Tween.get(Pong.player)
    .wait(100)
    .to({ y: topMargin }, 600, createjs.Ease.quartInOut)
    .to({ x: (Pong.canvas.width - 110) / 2 }, 600, createjs.Ease.quartInOut);
  createjs.Tween.get(Pong.cpu)
    .wait(100)
    .to({ y: topMargin }, 600, createjs.Ease.quartInOut)
    .to(
      { x: (Pong.canvas.width - 110) / 2 + 90 },
      600,
      createjs.Ease.quartInOut
    )
    .call(function() {
      createjs.Ticker.removeAllEventListeners("tick");
      document.querySelector("#logo").classList.remove("pong");
      document.querySelector("#logo").classList.add("pong-outro");
      document.body.removeChild(document.querySelector("#pong-stage"));
      document
        .querySelector("#logo")
        .addEventListener("animationend", function() {
          document.querySelector("#logo").classList.remove("pong-outro");
        });
    });
};

/**
 * Initializes Pong's variables.
 */
Pong.init = function() {
  //VARIABLES

  Pong.playing = false;
  Pong.balls = [];
  Pong.ball = {};
  Pong.ballWidth = 12;
  Pong.paddleWidth = 10;
  Pong.paddleHeight = 76;

  Pong.cpuSpeed = 12;

  Pong.playerScore = 0;
  Pong.cpuScore = 0;

  //link canvas
  Pong.canvas = document.getElementById("pong-stage");
  Pong.stage = new createjs.Stage(Pong.canvas);
  Pong.stage.mouseEventsEnabled = true;
  createjs.Touch.enable(Pong.stage);

  //DRAW STUFF.
  var topMargin = 22;
  Pong.bg = new createjs.Shape();
  Pong.bg.graphics
    .beginFill("#EDF2F7")
    .rect(0, 0, Pong.canvas.width, Pong.canvas.height)
    .endFill();
  Pong.player = new createjs.Shape();
  Pong.player.graphics
    .beginFill("#1A202C")
    .rect(0, 0, 20, 8) //top left
    .rect(0, 0, 10, 76) // left
    .rect(0, 68, 20, 8) // bottom left
    .endFill();
  Pong.cpu = new createjs.Shape();
  Pong.cpu.graphics
    .beginFill("#1A202C")
    .rect(0, 0, 20, 8)
    .rect(10, 0, 10, 76)
    .rect(0, 68, 20, 8)
    .endFill();
  Pong.stage.addChild(Pong.bg, Pong.player, Pong.cpu);
  Pong.bg.cache(0, 0, Pong.canvas.width, Pong.canvas.height);
  var ballGraphics = new createjs.Graphics();
  ballGraphics
    .beginFill("#1A202C")
    .rect(0, 0, 12, 12)
    .endFill();
  for (var i = 0; i < 3; i++) {
    var ball = new createjs.Shape(ballGraphics);
    Pong.balls.push(ball);
    Pong.stage.addChild(ball);
  }
  Pong.player.x = (Pong.canvas.width - 110) / 2;
  Pong.player.y = topMargin;
  Pong.balls[0].x = Pong.player.x + 28;
  Pong.balls[0].y = topMargin + 48;
  Pong.balls[1].x = Pong.player.x + 49;
  Pong.balls[1].y = topMargin + 48;
  Pong.balls[2].x = Pong.player.x + 70;
  Pong.balls[2].y = topMargin + 48;
  Pong.cpu.x = Pong.player.x + 90;
  Pong.cpu.y = topMargin;
  Pong.stage.update();

  //text fields
  Pong.playerScoreText = new createjs.Text("YOU : 0", "25px VT323", "#1A202C");
  Pong.playerScoreText.x = 10;
  Pong.playerScoreText.y = 5;
  Pong.cpuScoreText = new createjs.Text(
    "PARENTHESE : 0",
    "25px VT323",
    "#1A202C"
  );
  Pong.cpuScoreText.x = Pong.canvas.width - 150;
  Pong.cpuScoreText.y = 5;
  Pong.escText = new createjs.Text("QUIT: [ESC]", "20px VT323", "#1A202C");
  Pong.escText.x = Pong.canvas.width - 95;
  Pong.escText.y = Pong.canvas.height - 25;

  createjs.Ticker.framerate = 30;
  createjs.Ticker.addEventListener("tick", Pong.stage);

  Pong.launchIntro();
};

Pong.launchIntro = function() {
  for (var i = 0; i < 3; i++) {
    createjs.Tween.get(Pong.balls[i])
      .wait(100)
      .to({ y: 10 }, 500, createjs.Ease.quartInOut);
  }
  createjs.Tween.get(Pong.player)
    .wait(100)
    .to({ x: 10 }, 600, createjs.Ease.quartInOut)
    .to(
      { y: (Pong.canvas.height - Pong.paddleHeight) / 2 },
      600,
      createjs.Ease.quartInOut
    );
  createjs.Tween.get(Pong.cpu)
    .wait(100)
    .to(
      { x: Pong.canvas.width - Pong.paddleWidth - 20 },
      600,
      createjs.Ease.quartInOut
    )
    .to(
      { y: (Pong.canvas.height - Pong.paddleHeight) / 2 },
      600,
      createjs.Ease.quartInOut
    )
    .call(function() {
      Pong.stage.addChild(Pong.playerScoreText);
      Pong.stage.addChild(Pong.cpuScoreText);
      Pong.stage.addChild(Pong.escText);
      Pong.startGame();
    }); //start the game !
};

Pong.startGame = function() {
  if (Pong.playing) {
    return;
  }
  Pong.playing = true;

  if (Pong.msgText !== undefined) {
    Pong.stage.removeChild(Pong.msgText);
  }

  Pong.xspeed = 12;
  Pong.yspeed = 12;

  Pong.ball = Pong.balls.pop();
  Pong.stage.on("stagemousemove", Pong.movePaddle);

  createjs.Ticker.addEventListener("tick", Pong.tick);
};

Pong.movePaddle = function(e) {
  //prevents player to go out of canvas
  if (e.stageY < Pong.canvas.height - Pong.paddleHeight) {
    Pong.player.y = e.stageY;
  }
};

Pong.reset = function() {
  Pong.playing = false;
  Pong.stage.removeChild(Pong.ball);
  Pong.stage.onMouseMove = null;
  createjs.Ticker.removeEventListener("tick", Pong.tick);
  if (Pong.balls.length > 0) {
    //play another ball
    Pong.player.y = (Pong.canvas.height - Pong.paddleHeight) / 2;
    Pong.cpu.y = (Pong.canvas.height - Pong.paddleHeight) / 2;
    Pong.msgText = new createjs.Text("click to start", "25px VT323", "#1A202C");
    Pong.msgText.x = (Pong.canvas.width - Pong.msgText.getMeasuredWidth()) / 2;
    Pong.msgText.y = (Pong.canvas.height - 25) / 2;
    Pong.stage.addChild(Pong.msgText);
    Pong.bg.on("click", Pong.startGame);
  } else {
    //the game is over
    if (Pong.playerScore > Pong.cpuScore) {
      var text = "YOU WIN!!";
    } else {
      var text = "YOU LOOSE!!";
    }
    Pong.gameOverText = new createjs.Text(text, "75px VT323", "#1A202C");
    Pong.gameOverText.x =
      (Pong.canvas.width - Pong.gameOverText.getMeasuredWidth()) / 2;
    Pong.gameOverText.y = (Pong.canvas.height - 75) / 2;
    Pong.stage.addChild(Pong.gameOverText);
    createjs.Tween.get(Pong.gameOverText, { loop: true })
      .to({ alpha: 1, visible: true }, 1)
      .wait(500)
      .to({ alpha: 0, visible: false }, 1)
      .wait(500);
    Pong.bg.onPress = null;
  }
};

/**
 * Runs on every frame refresh. Quite important this one.
 */
Pong.tick = function() {
  //ball movement
  Pong.ball.x = Pong.ball.x + Pong.xspeed;
  Pong.ball.y = Pong.ball.y + Pong.yspeed;

  //cpu movement
  if (Pong.cpu.y >= Pong.ball.y + Pong.ballWidth / 2) {
    Pong.cpu.y -= Pong.cpuSpeed;
  } else if (
    Pong.cpu.y + Pong.paddleWidth <= Pong.ball.y + Pong.ballWidth / 2 &&
    Pong.cpu.y + Pong.paddleHeight < Pong.canvas.height
  ) {
    Pong.cpu.y += Pong.cpuSpeed;
  }

  //wall collision
  if (Pong.ball.y < 0) {
    Pong.yspeed *= -1;
  }
  if (Pong.ball.y + Pong.ballWidth >= Pong.canvas.height) {
    Pong.yspeed *= -1;
  }

  //cpu collision
  if (
    Pong.hit(
      Pong.ball.x,
      Pong.ball.y,
      Pong.ballWidth,
      Pong.ballWidth,
      Pong.cpu.x + 8,
      Pong.cpu.y,
      Pong.paddleWidth,
      Pong.paddleHeight
    )
  ) {
    Pong.xspeed *= -1;
  }

  //player collision
  if (
    Pong.hit(
      Pong.ball.x,
      Pong.ball.y,
      Pong.ballWidth,
      Pong.ballWidth,
      Pong.player.x + 8,
      Pong.player.y,
      Pong.paddleWidth,
      Pong.paddleHeight
    )
  ) {
    Pong.xspeed *= 1.05;
    Pong.yspeed *= 1.05;
    Pong.xspeed *= -1;
  }

  //cpu score :(
  if (Pong.ball.x < 10) {
    Pong.cpuScore++;
    Pong.cpuScoreText.text = "PARENTHESE : " + Pong.cpuScore;
    Pong.xspeed *= -1;
    Pong.reset();
  }

  //player score :)
  if (Pong.ball.x > Pong.canvas.width - 10) {
    Pong.playerScore++;
    Pong.playerScoreText.text = "YOU : " + Pong.playerScore;
    Pong.xspeed *= -1;
    Pong.reset();
  }
  Pong.stage.update();
};

Pong.hit = function(x1, y1, w1, h1, x2, y2, w2, h2) {
  if (x1 + w1 < x2) return false;
  if (x2 + w2 < x1) return false;
  if (y1 + h1 < y2) return false;
  if (y2 + h2 < y1) return false;

  return true;
};

document.getElementById("logo").addEventListener("click", Pong.display);
