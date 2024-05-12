import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { boardsFeatureKey, boardsReducer } from './store/boards/reducers';
import * as boardsEffects from './store/boards/effects';
import * as currentBoardEffects from './store/current-board/effects';
import * as cardEffects from './store/card/effects';
import * as listEffects from './store/lists/effects';
import * as cardChangesEffects from './store/card-changes/effects';
import * as boardChangesEffects from './store/board-changes/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideStore(),
    provideState(boardsFeatureKey, boardsReducer),
    provideEffects(
      boardsEffects,
      currentBoardEffects,
      cardEffects,
      listEffects,
      cardChangesEffects,
      boardChangesEffects,
    ),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
  ],
};
