import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Card } from '../types/shared/card';
import { CreateCard } from '../types/requests/create-card';
import { UpdateCard } from '../types/requests/update-card';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private readonly cardsEndpoint = `${environment.apiBaseUrl}/cards`;

  constructor(private httpClient: HttpClient) {}

  getCardById(id: number): Observable<Card> {
    return this.httpClient.get<Card>(`${this.cardsEndpoint}/${id}`);
  }

  addCard(card: CreateCard): Observable<Card> {
    return this.httpClient.post<Card>(this.cardsEndpoint, card);
  }

  updateCard(card: UpdateCard): Observable<void> {
    return this.httpClient.put<void>(`${this.cardsEndpoint}/${card.id}`, card);
  }

  deleteCard(cardId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.cardsEndpoint}/${cardId}`);
  }
}
