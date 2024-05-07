import { Routes } from '@angular/router';
import { CardDetailsComponent } from './components/pages/board-page/card-details/card-details.component';
import { AddEditCardComponent } from './components/pages/board-page/add-edit-card/add-edit-card.component';
import { HistorySidebarComponent } from './components/pages/board-page/history-sidebar/history-sidebar.component';
import { TaskBoardComponent } from './components/pages/board-page/task-board/task-board.component';
import { AddEditBoardComponent } from './components/pages/add-edit-board/add-edit-board.component';
import { RedirectToBoardComponent } from './components/pages/redirect-to-board/redirect-to-board.component';
import { provideState } from '@ngrx/store';
import {
  currentBoardFeatureKey,
  currentBoardReducer,
} from './store/current-board/reducers';
import { cardFeatureKey, cardReducer } from './store/card/reducers';
import {
  cardChangesFeatureKey,
  cardChangesReducer,
} from './store/card-changes/reducers';
import { boardChangesFeatureKey, boardChangesReducer } from './store/board-changes/reducers';

export const routes: Routes = [
  {
    path: 'boards/:boardId/edit',
    component: AddEditBoardComponent,
  },
  {
    path: 'boards/new',
    component: AddEditBoardComponent,
  },
  {
    path: 'boards/:boardId',
    component: TaskBoardComponent,
    providers: [
      provideState(currentBoardFeatureKey, currentBoardReducer),
      provideState(cardFeatureKey, cardReducer),
    ],
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
        providers: [provideState(cardChangesFeatureKey, cardChangesReducer)],
      },
      {
        path: 'history',
        component: HistorySidebarComponent,
        providers: [provideState(boardChangesFeatureKey, boardChangesReducer)],
      },
    ],
  },
  {
    path: '',
    component: RedirectToBoardComponent,
  },
];
