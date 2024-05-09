import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TaskBoardComponent } from './task-board.component';
import { BoardWithLists } from '../../../../types/shared/board-with-lists';
import { provideMockStore } from '@ngrx/store/testing';
import { fn } from '@storybook/test';

const initialState: { currentBoard: BoardWithLists } = {
  currentBoard: {
    id: 1,
    name: 'Board',
    lists: [
      {
        id: 1,
        name: 'Planned',
        cards: [
          {
            id: 1,
            name: 'Clean the house',
            dueDate: '2024-10-10T13:37:00Z',
            description: '',
            priority: 'Low',
          },
          {
            id: 3,
            name: 'Catch up with friends',
            dueDate: '2024-10-10T13:37:00Z',
            description: '',
            priority: 'Medium',
          },
        ],
      },
      {
        id: 2,
        name: 'Done',
        cards: [
          {
            id: 2,
            name: 'Get groceries',
            dueDate: '2024-10-10T13:37:00Z',
            description: 'Milk, bread, fruits, coffee',
            priority: 'High',
          },
        ],
      },
    ],
  },
};

const meta: Meta<TaskBoardComponent> = {
  title: 'Task Board',
  component: TaskBoardComponent,
  tags: ['autodocs'],
  args: {
    onDeleteClick: fn(),
  },
};

export default meta;

type Story = StoryObj<TaskBoardComponent>;

export const WithLists: Story = {
  decorators: [
    moduleMetadata({
      providers: [provideMockStore({ initialState })],
    }),
  ],
};

export const Empty: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        provideMockStore({
          initialState: {
            currentBoard: {
              ...initialState.currentBoard,
              lists: [],
            },
          },
        }),
      ],
    }),
  ],
};
