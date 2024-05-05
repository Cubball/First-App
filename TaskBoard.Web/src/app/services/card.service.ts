import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateUpdateCard } from '../types/requests/create-update-card';
import { Card } from '../types/shared/card';
import { BoardService } from './board.service';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private readonly cardsEndpoint = `${environment.apiBaseUrl}/cards`;

  constructor(
    private httpClient: HttpClient,
    private boardService: BoardService,
  ) {}

  getCardById(id: number): Observable<Card> {
    return this.httpClient.get<Card>(`${this.cardsEndpoint}/${id}`);
  }

  addCard(card: CreateUpdateCard, boardId: number): Observable<void> {
    return this.httpClient
      .post<void>(this.cardsEndpoint, card)
      .pipe(tap(() => this.boardService.fetchBoard(boardId)));
  }

  updateCard(id: number, card: CreateUpdateCard, boardId: number): Observable<void> {
    return this.httpClient
      .put<void>(`${this.cardsEndpoint}/${id}`, card)
      .pipe(tap(() => this.boardService.fetchBoard(boardId)));
  }

  deleteCard(cardId: number, boardId: number): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.cardsEndpoint}/${cardId}`)
      .pipe(tap(() => this.boardService.fetchBoard(boardId)));
  }
}
