
/**
 * @interface Block
 * @description Hindernisse zwischen Spieler und Gegner.
 * Wenn ein Block getroffen wird, wird er um 1 reduziert.
 * Wenn der Block 0 Treffer hat, wird er entfernt.
 * @property x - X-Koordinate des Blocks
 * @property y - Y-Koordinate des Blocks
 * @property width - Breite des Blocks
 * @property height - Höhe des Blocks
 * @property hitsLeft - Anzahl der Treffer, die der Block noch aushält
 */
export interface Block {
    x: number;
    y: number;
    width: number;
    height: number;
    hitsLeft: number;
}

export default Block;

/**
 * @function createBlock
 * @description Erstellt einen neuen Block. Standardmäßig hat der Block 3 Treffer.
 * @param x - X-Koordinate des Blocks
 * @param y - Y-Koordinate des Blocks
 * @param width - Breite des Blocks
 * @param height - Höhe des Blocks
 * @param hitsLeft - Anzahl der Treffer, die der Block noch aushält. Optional, standardmäßig 3.
 * @returns Block
 * @example
 * const block = createBlock(100, 100, 100, 100);
 */
export function createBlock(x: number, y: number, width: number, height: number, hitsLeft?: number): Block {
    return { x, y, width, height, hitsLeft: hitsLeft ?? 3 as number };
}

/**
 * @function drawBlocks
 * @description Zeichnet die Blöcke auf den Canvas
 * @param blocks - Array von Blöcken
 * @param ctx - CanvasRenderingContext2D
 * @returns void
 * @example
 * drawBlocks(blocks, ctx);
 */
export function drawBlocks(blocks: Block[], ctx: CanvasRenderingContext2D): void {
    for (const block of blocks) {
        ctx.fillStyle = block.hitsLeft >= 3 ? '#888888' : block.hitsLeft === 2 ? '#666666' : '#aa4444';
        ctx.fillRect(block.x, block.y, block.width, block.height);
    }
}
