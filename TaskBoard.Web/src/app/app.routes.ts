import { Routes } from '@angular/router';
import { CardDetailsComponent } from './components/card-details/card-details.component';
import { AddEditCardComponent } from './components/add-edit-card/add-edit-card.component';
import { HistorySidebarComponent } from './components/history-sidebar/history-sidebar.component';

export const routes: Routes = [
  {
    path: 'cards/new/:listId',
    component: AddEditCardComponent,
  },
  {
    path: 'cards/:id/edit',
    component: AddEditCardComponent,
  },
  {
    path: 'cards/:id',
    component: CardDetailsComponent,
  },
  {
    path: 'history',
    component: HistorySidebarComponent,
  },
];
