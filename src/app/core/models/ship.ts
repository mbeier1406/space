
/** Zustand des Raumschiffs */
export enum ShipState {
    Alive = 'ALIVE',
    Exploding = 'EXPLODING', // Schiff wurde getroffen, Explosionsanimation läuft
    Dead = 'DEAD',
}

/** Interface für das Raumschiff */
interface Ship {
    state : ShipState;
    positionX : number;
    positionY : number;
    lastPositionX : number;
    image : HTMLImageElement;
    readonly width : number;
    readonly height : number;
    explosionImage : HTMLImageElement;
    explosionFrame : number;
    explosionFrameStartedAt : number;
}
export default Ship;

export const SHIP_WIDTH = 56;
export const SHIP_HEIGHT = 70;

/** Anzahl der Frames im Explosions-Sprite-Sheet (horizontal angeordnet) */
export const EXPLOSION_FRAME_COUNT = 3;
/** Dauer eines einzelnen Explosions-Frames in Millisekunden */
export const EXPLOSION_FRAME_DURATION_MS = 200;
/** Skalierungsfaktor: Explosion etwas größer als das Schiff */
export const EXPLOSION_SCALE = 1.4;

/**
 * Erstellt ein neues Raumschiff und lädt das Bild
 * @param positionX - Die X-Position des Raumschiffs
 * @param positionY - Die Y-Position des Raumschiffs
 * @param onImageLoaded - Die Funktion, die aufgerufen wird, wenn das Bild geladen ist
 * @returns Das neue Raumschiff
 * @example
 * const ship = createShip(100, 100, () => {
 *   console.log('Bild geladen');
 * });
 */
export function createShip(
    positionX: number,
    positionY: number,
    img: string,
    onImageLoaded: () => void
  ): Ship {
    const image = new Image();
    image.onload = onImageLoaded;
    image.src = img;
    const explosionImage = new Image();
    explosionImage.src = img.replace('.png', '-explosion.png');
    return {
        state: ShipState.Alive,
        positionX,
        positionY,
        lastPositionX: positionX,
        image: image,
        width: SHIP_WIDTH,
        height: SHIP_HEIGHT,
        explosionImage: explosionImage,
        explosionFrame: 0,
        explosionFrameStartedAt: 0,
    };
}

/**
 * Startet die Explosionsanimation für ein Schiff.
 * Setzt den Zustand auf Exploding und initialisiert Frame-Index/Timer.
 * @param ship - Das Raumschiff
 */
export function startExplosion(ship: Ship): void {
    ship.state = ShipState.Exploding;
    ship.explosionFrame = 0;
    ship.explosionFrameStartedAt = performance.now();
}

/**
 * Schreibt die Explosionsanimation eines Schiffs voran.
 * Wechselt nach Ablauf des letzten Frames in den Zustand Dead.
 * @param ship - Das Raumschiff
 */
export function updateExplosion(ship: Ship): void {
    if (ship.state !== ShipState.Exploding) return;
    const now = performance.now();
    if (now - ship.explosionFrameStartedAt < EXPLOSION_FRAME_DURATION_MS) return;
    ship.explosionFrame++;
    ship.explosionFrameStartedAt = now;
    if (ship.explosionFrame >= EXPLOSION_FRAME_COUNT) {
        ship.state = ShipState.Dead;
    }
}

/**
 * Setzt die Position des Raumschiffs auf den Mittelpunkt des Canvas
 * @param ship - Das Raumschiff
 * @param canvasWidth - Die Breite des Canvas
 * @param canvasHeight - Die Höhe des Canvas
 * @returns void
 * @example
 * repositionShip(ship!, canvasWidth, canvasHeight);
 */
export function repositionShip(ship: Ship, canvasWidth: number, canvasHeight: number): void {
    ship!.positionX = (canvasWidth / 2) - (ship!.width / 2);
    ship!.positionY = canvasHeight - ship!.height;
    ship!.lastPositionX = ship!.positionX;
}

/**
 * Bewegt das Raumschiff nach links oder rechts innerhalb des Canvas.
 * @param ship - Das Raumschiff
 * @param direction - Die Richtung, in die das Raumschiff bewegt werden soll
 * @param speed - Die Geschwindigkeit, mit der das Raumschiff bewegt wird
 * @returns void
 * @example
 * moveShip(ship!, 'ArrowRight', 10, 1000);
 */
export function moveShip(ship: Ship, direction: 'ArrowRight' | 'ArrowLeft', speed: number, canvasWidth: number): void {
    if (direction === 'ArrowLeft') {
        if (ship!.positionX > 0) ship!.positionX -= speed;
    } else if (direction === 'ArrowRight') {
        if (ship!.positionX < canvasWidth - ship!.width) {
            ship!.positionX += speed;
        }
    }
}

/**
 * Zeichnet das Raumschiff auf den Canvas. Löscht die letzte Position des Raumschiffs und zeichnet es neu.
 * Aktualisiert die letzte Position des Raumschiffs.
 * @param ship - Das Raumschiff
 * @param ctx - Der CanvasRenderingContext2D
 * @returns void
 * @example
 * drawShip(ship!, ctx);
 */
export function drawShip(ship: Ship, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#000000';
    ctx.fillRect(ship.lastPositionX, ship.positionY, ship.width, ship.height);
    ship.lastPositionX = ship.positionX;

    if (ship.state === ShipState.Alive) {
        ctx.drawImage(ship.image, ship.positionX, ship.positionY, ship.width, ship.height);
        return;
    }

    if (ship.state === ShipState.Exploding) {
        const img = ship.explosionImage;
        if (!img.complete || img.naturalWidth === 0) return;
        const frameW = img.naturalWidth / EXPLOSION_FRAME_COUNT;
        const frameH = img.naturalHeight;
        const drawW = ship.width * EXPLOSION_SCALE;
        const drawH = ship.height * EXPLOSION_SCALE;
        const drawX = ship.positionX - (drawW - ship.width) / 2;
        const drawY = ship.positionY - (drawH - ship.height) / 2;
        ctx.drawImage(
            img,
            ship.explosionFrame * frameW, 0, frameW, frameH,
            drawX, drawY, drawW, drawH
        );
    }
}
