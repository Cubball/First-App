import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { List } from '../types/shared/list';
import { HttpClient } from '@angular/common/http';
import { CreateUpdateList } from '../types/requests/create-update-list';
import { CardService } from './card.service';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private readonly listsEndpoint = `${environment.apiBaseUrl}/lists`;
  private readonly lists = new BehaviorSubject<List[]>([]);

  constructor(
    private httpClient: HttpClient,
    private cardService: CardService,
  ) {
    this.fetchLists();
  }

  getAllLists(): Observable<List[]> {
    return this.lists.asObservable();
  }

  addList(list: CreateUpdateList): Observable<void> {
    const observable = this.httpClient.post<void>(this.listsEndpoint, list);
    observable.subscribe(() => {
      this.fetchLists();
      this.cardService.refetchCards();
    });
    return observable;
  }

  updateList(id: number, list: CreateUpdateList): Observable<void> {
    const observable = this.httpClient.put<void>(
      `${this.listsEndpoint}/${id}`,
      list,
    );
    observable.subscribe(() => {
      this.fetchLists();
      this.cardService.refetchCards();
    });
    return observable;
  }

  deleteList(id: number): Observable<void> {
    const observable = this.httpClient.delete<void>(
      `${this.listsEndpoint}/${id}`,
    );
    observable.subscribe(() => {
      this.fetchLists();
      this.cardService.refetchCards();
    });
    return observable;
  }

  private fetchLists(): void {
    this.httpClient
      .get<{ lists: List[] }>(this.listsEndpoint)
      .pipe(map((response) => response.lists))
      .subscribe((response) => this.lists.next(response));
  }
}
