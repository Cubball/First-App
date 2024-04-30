import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CardChange } from '../types/shared/card-change';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CardChangesList } from '../types/shared/card-changes-list';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private readonly historyEndpoint = `${environment.apiBaseUrl}/history`;

  constructor(private httpClient: HttpClient) {}

  getAllChangesForCard(cardId: number): Observable<CardChange[]> {
    return this.httpClient.get<CardChange[]>(
      `${this.historyEndpoint}/${cardId}`,
    );
  }

  getAllChanges(page: number, pageSize: number): Observable<CardChangesList> {
    return this.httpClient.get<CardChangesList>(this.historyEndpoint, {
      params: new HttpParams().appendAll({
        page,
        pageSize,
      }),
    });
  }
}
