import { Component, DestroyRef, DOCUMENT, ElementRef, inject, Signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import Star from '../../core/models/star';
import Bullet from '../../core/models/bullet';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  private readonly canvasRef : Signal<ElementRef<HTMLCanvasElement> | undefined> = viewChild<ElementRef<HTMLCanvasElement>>('spaceCanvas');
  private readonly destroyRef = inject(DestroyRef);
  private readonly doc = inject(DOCUMENT);
  protected readonly shipWidth : number = 56; // Breite des Raumschiffs
  protected readonly shipHeight : number = 70; // Höhe des Raumschiffs
  protected readonly viewportMargin : number = 0.05; // 5% Rand um Canvas

  private tickInterval : ReturnType<typeof setInterval> | null = null;
  private worker : Worker | null = null;

  private boundKeyDown = (event: KeyboardEvent) => this.handleKeyDown(event);
  private shipImg : HTMLImageElement = new Image();
  protected shipX : number = 0;
  protected shipY : number = 0;
  protected lastShipX : number = this.shipX;

  protected stars : Star[] = [];
  protected bullets : Bullet[] = [];

  /** Initialisiert das Raumschiff und die Sterne */
  constructor() {
    this.shipImg.src = '/ship.png';
    this.shipImg.onload = () => {
      this.draw();
    };
  }


  /** Startet das Spiel */
  protected ngAfterViewInit(): void {
    this.setCanvasSize();
    this.shipX = (this.canvasRef()?.nativeElement.width ?? 100)/2-this.shipWidth/2;
    this.shipY = (this.canvasRef()?.nativeElement.height ?? 100)-this.shipHeight;
    this.lastShipX = this.shipX;
    const starCount = Math.floor(Math.random()*100);
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * (this.canvasRef()?.nativeElement.width ?? 100),
        y: Math.random() * ((this.canvasRef()?.nativeElement.height ?? 100)-this.shipHeight),
        radius: 1,
        color: '#ffffff',
      });
    }
    this.draw();
    fromEvent(this.win, 'resize')
      .pipe(debounceTime(50), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setCanvasSize();
        this.shipX = (this.canvasRef()?.nativeElement.width ?? 100)/2-this.shipWidth/2;
        this.shipY = (this.canvasRef()?.nativeElement.height ?? 100)-this.shipHeight;
        this.lastShipX = this.shipX;
        this.draw();
    });
  }

  /** Liefert das Window-Objekt */
  private get win() { return this.doc.defaultView!; }

  /** Liefert den 2D-Kontext des Canvas-Elements */
  private get ctx(): CanvasRenderingContext2D | null {
    return this.canvasRef()?.nativeElement.getContext('2d') ?? null;
  }

  /** Setzt Canvas-Größe auf Viewport minus Rand */
  private setCanvasSize(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;
    const factor = 1 - 2 * this.viewportMargin;
    canvas.width = Math.floor(this.win.innerWidth * factor);
    canvas.height = Math.floor(this.win.innerHeight * factor);
  }
  
  /** Zeichnet den Hintergrund des Canvas-Elements und die Raumschiffe */
  private draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const canvas = ctx.canvas;

    // Hintergrund
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.drawStars();
    this.drawShip();
    this.drawBullets();
  }

  /** Zeichnet die Sterne */
  private drawStars(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    for (const star of this.stars) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
      ctx.fillStyle = star.color;
      ctx.fill();
    }
  }

  /** Löscht das letzte Raumschiff und zeichnet das neue */
  private drawShip(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.fillStyle = '#000000';
    ctx.fillRect(this.lastShipX, this.shipY, this.shipWidth, this.shipHeight);
    this.lastShipX = this.shipX;
    ctx.drawImage(this.shipImg, this.shipX, this.shipY, this.shipWidth, this.shipHeight);
  }

  /** Zeichnet die aktiven Bullets */
  private drawBullets(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    for (const bullet of this.bullets) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(bullet.x, bullet.oldY, bullet.width, bullet.height);
      ctx.fillStyle = bullet.color;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
  }

  /** Bewegt das Schiff nach rechts/links über die Pfeiltasten-Eingaben des Benutzers */
  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); // Verhindert das Scrollen der Seite beim Drücken der Pfeiltasten
      if (event.key === 'ArrowRight') this.shipX += 10;
      if (event.key === 'ArrowLeft') this.shipX -= 10;
      this.drawShip();
    }
    if (event.key === 'Space' || event.key === ' ') {
      this.bullets.push({
        x: this.shipX,
        y: this.shipY-15,
        oldY: this.shipY-15,
        velocityY: 10,
        width: 5,
        height: 15,
        color: '#ffffff',
      });
    }
    console.log('shipX', this.shipX);
  }

  /** Startet das Spiel */
  protected startTick(): void {
    this.stopTick();
    this.worker = new Worker(new URL('../../core/worker/space-worker', import.meta.url), { type: 'module' });
    this.worker.onmessage = (event: MessageEvent) => {
      this.bullets = event.data.bullets;
      this.draw();    
    };
    this.tickInterval = setInterval(() => this.worker?.postMessage({ type: 'tick', bullets: this.bullets }), 250);
    this.doc.addEventListener('keydown', this.boundKeyDown);
    console.log('started');
  }

  /** Stoppt das Spiel */
  protected stopTick(): void {
    this.tickInterval && clearInterval(this.tickInterval);
    this.tickInterval = null;
    this.worker?.terminate();
    this.worker = null;
    this.doc.removeEventListener('keydown', this.boundKeyDown);
    console.log('stopped');
  }

}
