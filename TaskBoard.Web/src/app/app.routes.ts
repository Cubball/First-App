import { Routes } from '@angular/router';
import { CardDetailsComponent } from './components/pages/board-page/card-details/card-details.component';
import { AddEditCardComponent } from './components/pages/board-page/add-edit-card/add-edit-card.component';
import { HistorySidebarComponent } from './components/pages/board-page/history-sidebar/history-sidebar.component';
import { TaskBoardComponent } from './components/pages/board-page/task-board/task-board.component';

export const routes: Routes = [
  {
    path: 'boards/:boardId',
    component: TaskBoardComponent,
    children: [
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
    ],
  },
];
