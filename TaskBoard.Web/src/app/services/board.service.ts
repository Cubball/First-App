import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BoardWithLists } from '../types/shared/board-with-lists';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Board } from '../types/shared/board';
import { CreateUpdateBoard } from '../types/requests/create-update-board';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly boardsEndpoint = `${environment.apiBaseUrl}/boards`;
  private readonly boardWithListsSubject = new BehaviorSubject<BoardWithLists>(
    undefined!,
  );
  private readonly boardsSubject = new BehaviorSubject<Board[]>([]);

  constructor(private httpClient: HttpClient) {}

  getBoardWithLists(id: number): Observable<BoardWithLists> {
    this.fetchBoard(id);
    return this.boardWithListsSubject.asObservable();
  }

  getAllBoards(): Observable<Board[]> {
    this.fetchBoards();
    return this.boardsSubject.asObservable();
  }

  addBoard(board: CreateUpdateBoard): Observable<Board> {
    return this.httpClient
      .post<Board>(this.boardsEndpoint, board)
      .pipe(tap((_) => this.fetchBoards()));
  }

  updateBoard(id: number, board: CreateUpdateBoard): Observable<void> {
    return this.httpClient
      .put<void>(`${this.boardsEndpoint}/${id}`, board)
      .pipe(tap((_) => this.fetchBoards()));
  }

  deleteBoard(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.boardsEndpoint}/${id}`)
      .pipe(tap(() => this.fetchBoards()));
  }

  fetchBoard(id: number): void {
    this.httpClient
      .get<BoardWithLists>(`${this.boardsEndpoint}/${id}`)
      .subscribe((board) => this.boardWithListsSubject.next(board));
  }

  private fetchBoards(): void {
    this.httpClient
      .get<{ boards: Board[] }>(this.boardsEndpoint)
      .pipe(map((response) => response.boards))
      .subscribe((boards) => this.boardsSubject.next(boards));
  }
}
