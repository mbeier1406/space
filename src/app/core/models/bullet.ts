interface Bullet {
    x: number;
    y: number;
    oldY: number;
    velocityY: number;
    width: number;
    height: number;
    color: string;
}

export default Bullet;

export const BULLET_WIDTH = 5;
export const BULLET_HEIGHT = 10;
export const BULLET_VELOCITY_Y = 15;
export const BULLET_COLOR = '#ffffff';

/**
 * Erstellt eine neue Bullet
 * @param x - Die X-Position der Bullet
 * @param y - Die Y-Position der Bullet
 * @returns Die neue Bullet
 * @example
 * const bullet = createBullet(100, 100);
 */
export function createBullet(x: number, y: number): Bullet {
    const bullet : Bullet = {
        x,
        y,
        oldY: y,
        velocityY: BULLET_VELOCITY_Y,
        width: BULLET_WIDTH,
        height: BULLET_HEIGHT,
        color: BULLET_COLOR
    };
    return bullet;
}

/**
 * Zeichnet die Bullets auf den Canvas
 * @param bullets - Ein Array von Bullets
 * @param ctx - Der CanvasRenderingContext2D
 * @returns void
 * @example
 * drawBullets(bullets, ctx);
 */
export function drawBullets(bullets: Bullet[], ctx: CanvasRenderingContext2D): void {
    for (const bullet of bullets) {
        drawBullet(bullet, ctx);
    }
}

/**
 * Zeichnet eine Bullet auf den Canvas
 * @param bullet - Die Bullet
 * @param ctx - Der CanvasRenderingContext2D
 * @returns void
 * @example
 * drawBullet(bullet, ctx);
 */
export function drawBullet(bullet: Bullet, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#000000';
    ctx.fillRect(bullet.x, bullet.oldY, bullet.width, bullet.height);
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
}

/**
 * Berechnet die neue Position der Bullets und entfernt die Bullets außerhalb des Bildschirms
 * @param bullets - Ein Array von Bullets
 * @returns Ein Array von Bullets mit der neuen Position und der alten Position
 * @example
 * const newBullets = moveBullets(bullets);
 */
export function moveBullets(bullets: Bullet[]): Bullet[] {
    return bullets
        .filter((bullet: Bullet) => bullet.y >= 0)
        .map((bullet: Bullet) => ({
            ...bullet,
            oldY: bullet.y,
            y: bullet.y - bullet.velocityY,
        }));
}
