import kaplay from "kaplay";
import "kaplay/global";

const k = kaplay();

k.setGravity(3200);

k.loadSprite("bean", "sprites/bean.png");

setBackground(141, 183, 255);

k.scene("game", () => {
  const bean = k.add([sprite("bean"), pos(width() / 4, 0), area(), body()]);

  const JUMP_FORCE = 800;

  onKeyPress("space", () => bean.jump(JUMP_FORCE));
  onGamepadButtonPress("south", () => bean.jump(JUMP_FORCE));
  onClick(() => bean.jump(JUMP_FORCE));

  const CEILING = -60;

  // check for fall death
  bean.onUpdate(() => {
    if (bean.pos.y >= height() || bean.pos.y <= CEILING) {
      // switch to "lose" scene
      go("lose", score);
    }
  });

  const PIPE_OPEN = 240;
  const PIPE_MIN = 60;
  const SPEED = 320;

  function spawnPipe() {
    const h1 = rand(PIPE_MIN, height() - PIPE_MIN - PIPE_OPEN);
    const h2 = height() - h1 - PIPE_OPEN;

    k.add([pos(width(), 0), rect(64, h1), area(), move(LEFT, SPEED), "pipe"]);

    k.add([
      pos(width(), h1 + PIPE_OPEN),
      rect(64, h2),
      area(),
      move(LEFT, SPEED),
      "pipe",
      { passed: false },
    ]);
  }

  k.loop(1, () => spawnPipe());

  let score = 0;

  // display score
  const scoreLabel = k.add([
    text(score),
    anchor("center"),
    pos(width() / 2, 80),
    fixed(),
    z(100),
  ]);

  function addScore() {
    score++;
    scoreLabel.text = score;
  }

  k.onUpdate("pipe", (p) => {
    if (p.pos.x + p.width <= bean.pos.x && p.passed === false) {
      addScore();
      p.passed = true;
    }
  });

  bean.onCollide("pipe", () => {
    go("lose", score);
    addKaboom(bean.pos);
  });
});

scene("lose", (score) => {
  k.add([
    sprite("bean"),
    pos(width() / 2, height() / 2 - 108),
    scale(3),
    anchor("center"),
  ]);
  k.add([
    text(score),
    pos(width() / 2, height() / 2 + 108),
    scale(3),
    anchor("center"),
  ]);

  onKeyPress("space", () => go("game"));
  onClick(() => go("game"));
});

go("game");
