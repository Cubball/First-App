import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BoardWithLists } from '../types/shared/board-with-lists';
import { Observable, map } from 'rxjs';
import { Board } from '../types/shared/board';
import { CreateBoard } from '../types/requests/create-board';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly boardsEndpoint = `${environment.apiBaseUrl}/boards`;

  constructor(private httpClient: HttpClient) {}

  getBoardWithLists(id: number): Observable<BoardWithLists> {
    return this.httpClient.get<BoardWithLists>(`${this.boardsEndpoint}/${id}`);
  }

  getAllBoards(): Observable<Board[]> {
    return this.httpClient
      .get<{ boards: Board[] }>(this.boardsEndpoint)
      .pipe(map(({ boards }) => boards));
  }

  addBoard(board: CreateBoard): Observable<Board> {
    return this.httpClient.post<Board>(this.boardsEndpoint, board);
  }

  updateBoard(id: number, board: CreateBoard): Observable<void> {
    return this.httpClient.put<void>(`${this.boardsEndpoint}/${id}`, board);
  }

  deleteBoard(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.boardsEndpoint}/${id}`);
  }
}
