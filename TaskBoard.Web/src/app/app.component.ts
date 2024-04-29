import { Component } from '@angular/core';
import { HeaderComponent } from './components/main-page/header/header.component';
import { TaskBoardComponent } from './components/main-page/task-board/task-board.component';
import { ListWithCards } from './types/shared/list-with-cards';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, TaskBoardComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'TaskBoard.Web';
  listsWithCards: ListWithCards[] = [
    {
      id: 1,
      name: 'Planned',
      cards: [
        {
          id: 1,
          name: 'Card Name 1',
          description: 'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
          dueDate: new Date('2024-05-01T00:00:00Z'),
          priority: 'Low',
        },
        {
          id: 2,
          name: 'Card Name 2',
          description: 'foo bar baz',
          dueDate: new Date('2024-05-01T00:00:00Z'),
          priority: 'High',
        },
        {
          id: 3,
          name: 'Card Name 3',
          description: 'AAAA',
          dueDate: new Date('2024-05-01T00:00:00Z'),
          priority: 'High',
        },
      ],
    },
    {
      id: 2,
      name: 'Done',
      cards: [
        {
          id: 4,
          name: 'Card Name 4',
          description: 'description',
          dueDate: new Date('2024-05-01T00:00:00Z'),
          priority: 'Low',
        },
        {
          id: 5,
          name: 'Card Name 5',
          description: 'foo bar baz',
          dueDate: new Date('2024-05-01T00:00:00Z'),
          priority: 'High',
        },
        {
          id: 6,
          name: 'Card Name 6',
          description: 'AAAA',
          dueDate: new Date('2024-05-01T00:00:00Z'),
          priority: 'High',
        },
      ],
    },
  ];
}
