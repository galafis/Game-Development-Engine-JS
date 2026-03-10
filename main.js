/**
 * 2D Game Development Engine
 * Canvas-based game engine with physics, sprite management,
 * input handling, and game loop.
 * @author Gabriel Demetrios Lafis
 */

// --- Vector2D ---

class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) { return new Vector2D(this.x + v.x, this.y + v.y); }
    subtract(v) { return new Vector2D(this.x - v.x, this.y - v.y); }
    scale(s) { return new Vector2D(this.x * s, this.y * s); }
    magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    normalize() {
        const mag = this.magnitude();
        return mag > 0 ? new Vector2D(this.x / mag, this.y / mag) : new Vector2D();
    }
    dot(v) { return this.x * v.x + this.y * v.y; }
    distance(v) { return this.subtract(v).magnitude(); }
    clone() { return new Vector2D(this.x, this.y); }
}

// --- Physics Body ---

class PhysicsBody {
    constructor(x, y, width, height, options = {}) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D();
        this.acceleration = new Vector2D();
        this.width = width;
        this.height = height;
        this.mass = options.mass || 1;
        this.restitution = options.restitution || 0.5;
        this.friction = options.friction || 0.1;
        this.isStatic = options.isStatic || false;
        this.isGrounded = false;
    }

    applyForce(force) {
        if (this.isStatic) return;
        const acc = force.scale(1 / this.mass);
        this.acceleration = this.acceleration.add(acc);
    }

    update(dt) {
        if (this.isStatic) return;
        this.velocity = this.velocity.add(this.acceleration.scale(dt));
        this.velocity = this.velocity.scale(1 - this.friction * dt);
        this.position = this.position.add(this.velocity.scale(dt));
        this.acceleration = new Vector2D();
    }

    getBounds() {
        return {
            left: this.position.x,
            right: this.position.x + this.width,
            top: this.position.y,
            bottom: this.position.y + this.height
        };
    }
}

// --- Physics Engine ---

class PhysicsEngine {
    constructor() {
        this.gravity = new Vector2D(0, 980);
        this.bodies = [];
    }

    addBody(body) {
        this.bodies.push(body);
        return body;
    }

    removeBody(body) {
        const index = this.bodies.indexOf(body);
        if (index > -1) this.bodies.splice(index, 1);
    }

    checkCollision(a, b) {
        const boundsA = a.getBounds();
        const boundsB = b.getBounds();
        return !(boundsA.right < boundsB.left || boundsA.left > boundsB.right ||
                 boundsA.bottom < boundsB.top || boundsA.top > boundsB.bottom);
    }

    resolveCollision(a, b) {
        if (a.isStatic && b.isStatic) return;

        const boundsA = a.getBounds();
        const boundsB = b.getBounds();

        const overlapX = Math.min(boundsA.right - boundsB.left, boundsB.right - boundsA.left);
        const overlapY = Math.min(boundsA.bottom - boundsB.top, boundsB.bottom - boundsA.top);

        if (overlapX < overlapY) {
            const sign = a.position.x < b.position.x ? -1 : 1;
            if (!a.isStatic) a.position.x += sign * overlapX / 2;
            if (!b.isStatic) b.position.x -= sign * overlapX / 2;
            const relVelX = a.velocity.x - b.velocity.x;
            const impulse = relVelX * (1 + Math.min(a.restitution, b.restitution));
            if (!a.isStatic) a.velocity.x -= impulse / 2;
            if (!b.isStatic) b.velocity.x += impulse / 2;
        } else {
            const sign = a.position.y < b.position.y ? -1 : 1;
            if (!a.isStatic) a.position.y += sign * overlapY / 2;
            if (!b.isStatic) b.position.y -= sign * overlapY / 2;
            if (sign < 0) a.isGrounded = true;
            const relVelY = a.velocity.y - b.velocity.y;
            const impulse = relVelY * (1 + Math.min(a.restitution, b.restitution));
            if (!a.isStatic) a.velocity.y -= impulse / 2;
            if (!b.isStatic) b.velocity.y += impulse / 2;
        }
    }

    update(dt) {
        for (const body of this.bodies) {
            if (!body.isStatic) {
                body.applyForce(this.gravity.scale(body.mass));
                body.isGrounded = false;
            }
            body.update(dt);
        }

        for (let i = 0; i < this.bodies.length; i++) {
            for (let j = i + 1; j < this.bodies.length; j++) {
                if (this.checkCollision(this.bodies[i], this.bodies[j])) {
                    this.resolveCollision(this.bodies[i], this.bodies[j]);
                }
            }
        }
    }
}

// --- Sprite ---

class Sprite {
    constructor(body, options = {}) {
        this.body = body;
        this.color = options.color || '#4CAF50';
        this.visible = true;
        this.animations = new Map();
        this.currentAnimation = null;
        this.animationFrame = 0;
        this.animationTimer = 0;
    }

    addAnimation(name, frames, frameDuration) {
        this.animations.set(name, { frames, frameDuration });
    }

    playAnimation(name) {
        if (this.currentAnimation !== name) {
            this.currentAnimation = name;
            this.animationFrame = 0;
            this.animationTimer = 0;
        }
    }

    update(dt) {
        if (this.currentAnimation) {
            const anim = this.animations.get(this.currentAnimation);
            if (anim) {
                this.animationTimer += dt;
                if (this.animationTimer >= anim.frameDuration) {
                    this.animationTimer = 0;
                    this.animationFrame = (this.animationFrame + 1) % anim.frames.length;
                }
            }
        }
    }

    render(ctx) {
        if (!this.visible) return;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.body.position.x, this.body.position.y, this.body.width, this.body.height);
    }
}

// --- Input Manager ---

class InputManager {
    constructor() {
        this.keys = new Map();
        this.mousePosition = new Vector2D();
        this.mouseButtons = new Map();
    }

    initialize(canvas) {
        if (typeof window === 'undefined') return;

        window.addEventListener('keydown', (e) => {
            this.keys.set(e.code, true);
        });

        window.addEventListener('keyup', (e) => {
            this.keys.set(e.code, false);
        });

        if (canvas) {
            canvas.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                this.mousePosition = new Vector2D(e.clientX - rect.left, e.clientY - rect.top);
            });

            canvas.addEventListener('mousedown', (e) => {
                this.mouseButtons.set(e.button, true);
            });

            canvas.addEventListener('mouseup', (e) => {
                this.mouseButtons.set(e.button, false);
            });
        }
    }

    isKeyDown(code) { return this.keys.get(code) || false; }
    isMouseDown(button) { return this.mouseButtons.get(button) || false; }
    getMousePosition() { return this.mousePosition.clone(); }
}

// --- Scene ---

class Scene {
    constructor(name) {
        this.name = name;
        this.sprites = [];
        this.active = false;
    }

    addSprite(sprite) { this.sprites.push(sprite); return sprite; }
    removeSprite(sprite) {
        const idx = this.sprites.indexOf(sprite);
        if (idx > -1) this.sprites.splice(idx, 1);
    }

    update(dt) {
        for (const sprite of this.sprites) sprite.update(dt);
    }

    render(ctx) {
        for (const sprite of this.sprites) sprite.render(ctx);
    }
}

// --- Game Engine ---

class GameEngine {
    constructor(canvasId, width = 800, height = 600) {
        this.width = width;
        this.height = height;
        this.physics = new PhysicsEngine();
        this.input = new InputManager();
        this.scenes = new Map();
        this.activeScene = null;
        this.isRunning = false;
        this.lastTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.fpsTimer = 0;
        this.canvas = null;
        this.ctx = null;
        this.backgroundColor = '#1a1a2e';

        if (typeof document !== 'undefined' && canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (this.canvas) {
                this.canvas.width = width;
                this.canvas.height = height;
                this.ctx = this.canvas.getContext('2d');
                this.input.initialize(this.canvas);
            }
        }
    }

    addScene(scene) {
        this.scenes.set(scene.name, scene);
        if (!this.activeScene) this.setActiveScene(scene.name);
    }

    setActiveScene(name) {
        if (this.activeScene) this.activeScene.active = false;
        this.activeScene = this.scenes.get(name) || null;
        if (this.activeScene) this.activeScene.active = true;
    }

    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }

    stop() { this.isRunning = false; }

    gameLoop(currentTime) {
        if (!this.isRunning) return;

        const dt = Math.min((currentTime - this.lastTime) / 1000, 0.05);
        this.lastTime = currentTime;

        this.frameCount++;
        this.fpsTimer += dt;
        if (this.fpsTimer >= 1) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTimer = 0;
        }

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
        this.physics.update(dt);
        if (this.activeScene) this.activeScene.update(dt);
    }

    render() {
        if (!this.ctx) return;
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (this.activeScene) this.activeScene.render(this.ctx);

        // FPS counter
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px monospace';
        this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);
    }
}

// --- Demo ---

function createDemoGame() {
    const engine = new GameEngine('gameCanvas', 800, 600);

    const mainScene = new Scene('main');
    engine.addScene(mainScene);

    // Ground
    const groundBody = new PhysicsBody(0, 550, 800, 50, { isStatic: true });
    engine.physics.addBody(groundBody);
    mainScene.addSprite(new Sprite(groundBody, { color: '#2d5a27' }));

    // Player
    const playerBody = new PhysicsBody(100, 400, 40, 40, { mass: 1, restitution: 0.3 });
    engine.physics.addBody(playerBody);
    const player = mainScene.addSprite(new Sprite(playerBody, { color: '#e74c3c' }));

    // Platforms
    const platforms = [
        { x: 200, y: 450, w: 150, h: 20 },
        { x: 450, y: 380, w: 150, h: 20 },
        { x: 300, y: 300, w: 120, h: 20 }
    ];

    for (const p of platforms) {
        const body = new PhysicsBody(p.x, p.y, p.w, p.h, { isStatic: true });
        engine.physics.addBody(body);
        mainScene.addSprite(new Sprite(body, { color: '#8B4513' }));
    }

    console.log('Game engine initialized with demo scene');
    console.log(`Scene: ${mainScene.sprites.length} sprites, Physics: ${engine.physics.bodies.length} bodies`);

    return engine;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameEngine, Scene, Sprite, PhysicsEngine, PhysicsBody, Vector2D, InputManager, createDemoGame };
} else if (typeof window !== 'undefined') {
    window.GameEngine = GameEngine;
    window.createDemoGame = createDemoGame;
}
