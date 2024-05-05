import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { List } from '../types/shared/list';
import { HttpClient } from '@angular/common/http';
import { UpdateList } from '../types/requests/update-list';
import { BoardService } from './board.service';
import { CreateList } from '../types/requests/create-list';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private readonly listsEndpoint = `${environment.apiBaseUrl}/lists`;
  private readonly lists = new BehaviorSubject<List[]>([]);

  constructor(
    private httpClient: HttpClient,
    private boardService: BoardService,
  ) {}

  getAllLists(boardId: number): Observable<List[]> {
    this.fetchLists(boardId);
    return this.lists.asObservable();
  }

  addList(list: CreateList, boardId: number): Observable<void> {
    return this.httpClient.post<void>(this.listsEndpoint, list).pipe(
      tap(() => {
        this.fetchLists(boardId);
        this.boardService.fetchBoard(boardId);
      }),
    );
  }

  updateList(
    id: number,
    list: UpdateList,
    boardId: number,
  ): Observable<void> {
    return this.httpClient.put<void>(`${this.listsEndpoint}/${id}`, list).pipe(
      tap(() => {
        this.fetchLists(boardId);
        this.boardService.fetchBoard(boardId);
      }),
    );
  }

  deleteList(id: number, boardId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.listsEndpoint}/${id}`).pipe(
      tap(() => {
        this.fetchLists(boardId);
        this.boardService.fetchBoard(boardId);
      }),
    );
  }

  private fetchLists(boardId: number): void {
    if (!boardId) {
      return;
    }

    this.httpClient
      .get<{ lists: List[] }>(
        `${environment.apiBaseUrl}/boards/${boardId}/lists`,
      )
      .pipe(map((response) => response.lists))
      .subscribe((response) => this.lists.next(response));
  }
}
