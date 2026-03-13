import Bullet from '../models/bullet';

self.onmessage = (event: MessageEvent) => {

    if (event.data?.type === 'tick' && Array.isArray(event.data.bullets)) {
        const bullets = event.data.bullets
        .filter((bullet: Bullet) => bullet.y >= 0)
        .map((bullet: Bullet) => ({
          ...bullet,
          oldY: bullet.y,
          y: bullet.y - bullet.velocityY,
        }));
        self.postMessage({ type: 'tick', bullets });
    }
}
