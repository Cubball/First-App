import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ListWithCards } from '../types/shared/list-with-cards';
import { environment } from '../../environments/environment';
import { CreateUpdateCard } from '../types/requests/create-update-card';
import { Card } from '../types/shared/card';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private readonly cardsEndpoint = `${environment.apiBaseUrl}/cards`;
  private readonly listsWithCardsSubject = new BehaviorSubject<ListWithCards[]>(
    [],
  );

  constructor(private httpClient: HttpClient) {
    this.refetchCards();
  }

  getAllCardsInLists(): Observable<ListWithCards[]> {
    return this.listsWithCardsSubject.asObservable();
  }

  getCardById(id: number): Observable<Card> {
    return this.httpClient.get<Card>(`${this.cardsEndpoint}/${id}`);
  }

  addCard(card: CreateUpdateCard): Observable<void> {
    return this.httpClient
      .post<void>(this.cardsEndpoint, card)
      .pipe(tap(() => this.refetchCards()));
  }

  updateCard(id: number, card: CreateUpdateCard): Observable<void> {
    return this.httpClient
      .put<void>(`${this.cardsEndpoint}/${id}`, card)
      .pipe(tap(() => this.refetchCards()));
  }

  deleteCard(cardId: number): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.cardsEndpoint}/${cardId}`)
      .pipe(tap(() => this.refetchCards()));
  }

  refetchCards(): void {
    this.httpClient
      .get<{ lists: ListWithCards[] }>(this.cardsEndpoint)
      .pipe(map((response) => response.lists))
      .subscribe((response) => this.listsWithCardsSubject.next(response));
  }
}
