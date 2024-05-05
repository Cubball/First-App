import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CardChange } from '../types/shared/card-change';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CardChangesList } from '../types/shared/card-changes-list';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  constructor(
    private httpClient: HttpClient,
  ) {}

  getAllChangesForCard(cardId: number): Observable<CardChange[]> {
    return this.httpClient
      .get<{
        changes: CardChange[];
      }>(`${environment.apiBaseUrl}/cards/${cardId}/history`)
      .pipe(map((response) => response.changes));
  }

  getAllChanges(boardId: number, page: number, pageSize: number): Observable<CardChangesList> {
    return this.httpClient.get<CardChangesList>(
      `${environment.apiBaseUrl}/boards/${boardId}/history`,
      {
        params: new HttpParams().appendAll({
          page,
          pageSize,
        }),
      },
    );
  }
}
