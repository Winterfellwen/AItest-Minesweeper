class Particle {
  constructor(x, y, angle, speed, color) {
    this.pos = { x, y };
    this.vel = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
    this.alpha = 1.0;
    this.decay = 0.012 + Math.random() * 0.015;
    this.color = color;
    this.size = 1.5 + Math.random() * 2;
    this.gravity = 0.05;
  }

  update() {
    this.vel.y += this.gravity;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.alpha -= this.decay;
  }
}

class Firework {
  constructor(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth * 0.8 + canvasWidth * 0.1;
    this.targetY = canvasHeight * 0.15 + Math.random() * canvasHeight * 0.2;
    this.y = canvasHeight;
    this.speed = 3 + Math.random() * 2;
    this.particles = [];
    this.phase = "rising";
    this.hueOffset = Math.random() * 360;
  }

  update(canvasWidth, canvasHeight) {
    if (this.phase === "rising") {
      this.y -= this.speed;
      if (this.y <= this.targetY) {
        this.burst(canvasWidth, canvasHeight);
        this.phase = "burst";
      }
    } else if (this.phase === "burst") {
      this.particles = this.particles.filter((p) => p.alpha > 0.01);
      this.particles.forEach((p) => p.update());
      if (this.particles.length === 0) {
        this.phase = "done";
      }
    }
  }

  burst(canvasWidth, canvasHeight) {
    const count = 80 + Math.floor(Math.random() * 50);
    const baseHue = this.hueOffset;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = 1.5 + Math.random() * 4;
      const hue = (baseHue + Math.random() * 40) % 360;
      this.particles.push(
        new Particle(this.x, this.y, angle, speed, `hsl(${hue}, 85%, 60%)`)
      );
    }
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30 + (Math.random() - 0.5) * 0.3;
      const speed = 0.5 + Math.random() * 1.5;
      this.particles.push(
        new Particle(this.x, this.y, angle, speed, `hsl(${(baseHue + 60) % 360}, 90%, 80%)`)
      );
    }
  }
}

export class FireworksEngine {
  constructor(ctx, width, height, onDone) {
    this.ctx = ctx;
    this.canvasW = width;
    this.canvasH = height;
    this.fireworks = [];
    this.animId = null;
    this.elapsed = 0;
    this.totalFireworks = 6;
    this.launchInterval = 350;
    this.allDone = onDone || (() => {});
  }

  trigger() {
    this.elapsed = 0;
    this.fireworks = [];
    this.loop();
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);
    this.elapsed += 16.67;

    const toLaunch = Math.min(
      this.totalFireworks,
      Math.floor(this.elapsed / this.launchInterval)
    );
    while (this.fireworks.filter((f) => f.phase !== "done").length < toLaunch &&
           this.fireworks.length < this.totalFireworks) {
      this.fireworks.push(new Firework(this.canvasW, this.canvasH));
    }

    let alive = false;
    this.fireworks.forEach((fw) => {
      fw.update(this.canvasW, this.canvasH);
      if (fw.phase !== "done") alive = true;

      if (fw.phase === "rising") {
        this.ctx.save();
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillStyle = "#FFF";
        this.ctx.beginPath();
        this.ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      } else if (fw.phase === "burst") {
        this.ctx.save();
        this.ctx.globalCompositeOperation = "lighter";
        fw.particles.forEach((p) => {
          this.ctx.globalAlpha = p.alpha;
          this.ctx.fillStyle = p.color;
          this.ctx.beginPath();
          this.ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2);
          this.ctx.fill();
        });
        this.ctx.restore();
      }
    });

    if (alive || this.elapsed < this.totalFireworks * this.launchInterval + 2000) {
      this.animId = wx.requestAnimationFrame(() => this.loop());
    } else {
      this.animId = null;
      this.allDone();
    }
  }

  stop() {
    if (this.animId !== null) {
      wx.cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.fireworks = [];
  }
}
