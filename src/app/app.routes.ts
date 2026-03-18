import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Start } from './features/start/start';

const routes: Routes = [
  {
    path: '',
    component: Start,
    title: 'Space Start'
  },
  {
    path: 'game',
    component: Home,
    title: 'Space'
  }
];

export default routes;

