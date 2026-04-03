import { Injectable } from '@angular/core';
import Bullet from '../models/bullet';
import Ship from '../models/ship';

/**
 * Interface für eine Kollision zwischen einer Bullet und einem Schiff.
 * @example
 * const collision: CollisionHit = {
 *   bulletIndex: 0,
 *   shipIndex: 0,
 * };
 */
export interface CollisionHit {
  bulletIndex: number;
  shipIndex: number;
}

@Injectable({
  providedIn: 'root',
})
export class CollisionService {

  /**
   * Findet alle Treffer zwischen den Bullets und den Schiffen.
   * Ein sehr einfaches Modell, das für alle Objekte ein einfaches Rechteck verwendet.
   * @param bullets - Die Bullets.
   * @param ships - Die Schiffe.
   * @returns Die Treffer.
   * @example
   * const hits = findHits(bullets, ships);
   */
  public findHits(bullets: Bullet[], ships: Ship[]): CollisionHit[] | undefined {
    const hits: CollisionHit[] = [];
    for (let bulletIndex = 0; bulletIndex < bullets.length; bulletIndex++) {
      const bullet = bullets[bulletIndex];
      for (let shipIndex = 0; shipIndex < ships.length; shipIndex++) {
        const ship = ships[shipIndex];
        if (bullet.x < ship.positionX + ship.width &&
          bullet.x + bullet.width > ship.positionX &&
          bullet.y < ship.positionY + ship.height &&
          bullet.y + bullet.height > ship.positionY) {
          hits.push({ bulletIndex, shipIndex });
          console.log('Treffer gefunden:', bulletIndex, shipIndex);
          // console.log('bullet.x:', bullet.x);
          // console.log('ship.positionX + ship.width:', ship.positionX + ship.width);
          // console.log('bullet.x + bullet.width:', bullet.x + bullet.width);
          // console.log('ship.positionX:', ship.positionX);
          // console.log('bullet.y:', bullet.y);
          // console.log('ship.positionY + ship.height:', ship.positionY + ship.height);
          // console.log('bullet.y + bullet.height:', bullet.y + bullet.height);
          // console.log('ship.positionY:', ship.positionY);
        }
      }
    }
    return hits.length > 0 ? hits : undefined;
  }

}
