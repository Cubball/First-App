import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
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

  addList(list: CreateUpdateList) {
    this.httpClient.post(this.listsEndpoint, list).subscribe((_) => {
      this.fetchLists();
      this.cardService.refetchCards();
    });
  }

  updateList(id: number, list: CreateUpdateList) {
    this.httpClient.put(`${this.listsEndpoint}/${id}`, list).subscribe((_) => {
      this.fetchLists();
      this.cardService.refetchCards();
    });
  }

  deleteList(id: number) {
    this.httpClient.delete(`${this.listsEndpoint}/${id}`).subscribe((_) => {
      this.fetchLists();
      this.cardService.refetchCards();
    });
  }

  private fetchLists(): void {
    this.httpClient
      .get<{ lists: List[] }>(this.listsEndpoint)
      .pipe(map((response) => response.lists))
      .subscribe((response) => this.lists.next(response));
  }
}
