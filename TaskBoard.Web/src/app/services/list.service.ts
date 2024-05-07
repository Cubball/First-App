import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';
import { List } from '../types/shared/list';
import { HttpClient } from '@angular/common/http';
import { UpdateList } from '../types/requests/update-list';
import { CreateList } from '../types/requests/create-list';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private readonly listsEndpoint = `${environment.apiBaseUrl}/lists`;

  constructor(private httpClient: HttpClient) {}

  getAllLists(boardId: number): Observable<List[]> {
    return this.httpClient
      .get<{
        lists: List[];
      }>(`${environment.apiBaseUrl}/boards/${boardId}/lists`)
      .pipe(map((response) => response.lists));
  }

  addList(list: CreateList): Observable<List> {
    return this.httpClient.post<List>(this.listsEndpoint, list);
  }

  updateList(list: UpdateList): Observable<void> {
    return this.httpClient.put<void>(`${this.listsEndpoint}/${list.id}`, list);
  }

  deleteList(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.listsEndpoint}/${id}`);
  }
}
