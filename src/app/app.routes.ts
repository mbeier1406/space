/**
 * Routen-Tabelle der Anwendung.
 *
 * Wird in app.config.ts an provideRouter(routes) übergeben.
 * Der Router vergleicht die URL (nach dem Host, z. B. / oder /game)
 * von oben nach unten mit path. Die passende Komponente erscheint
 * in <router-outlet> (app.html).
 *
 * title setzt den Dokumenttitel im Browser-Tab.
 */
import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Start } from './features/start/start';

const routes: Routes = [
  // Leerer Pfad: http://localhost:4200/ → Startbildschirm
  {
    path: '',
    component: Start,
    title: 'Space Start'
  },
  // http://localhost:4200/game → Spiel (Home-Komponente)
  // TODO: Hier noch authGuard einbauen
  {
    path: 'game',
    component: Home,
    title: 'Space'
  },
  // '**' = Wildcard, fängt jede unbekannte URL ab (z. B. /foo).
  // redirectTo: '' schickt den Nutzer zurück zum Start.
  // pathMatch: 'full' heißt: die ganze Rest-URL muss matchen, nicht nur ein Präfix.
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

// Default-Export: import routes from './app.routes' (ohne geschweifte Klammern)
export default routes;
