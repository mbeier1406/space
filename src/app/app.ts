import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root-Component der Anwendung
 * @description
 * Die Haupt-Component, die als Einstiegspunkt der Angular-Anwendung dient.
 * Enthält die Router-Konfiguration und den Anwendungstitel.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Space');
}
