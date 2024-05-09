import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { HistorySidebarComponent } from './history-sidebar.component';
import { provideMockStore } from '@ngrx/store/testing';
import { CardChangesList } from '../../../../types/shared/card-changes-list';
import { fn } from '@storybook/test';

const meta: Meta<HistorySidebarComponent> = {
  title: 'History Sidebar',
  component: HistorySidebarComponent,
  tags: ['autodocs'],
  args: {
    getMoreChanges: fn(),
  },
};

export default meta;

type Story = StoryObj<HistorySidebarComponent>;

const initialState: { boardChanges: CardChangesList } = {
  boardChanges: {
    totalItems: 5,
    pageNumber: 1,
    pageSize: 20,
    items: [
      {
        updatedAt: '2020-10-10T13:37:00Z',
        cardId: 1,
        currentState: {
          name: 'Bar',
          description: '',
          priority: 'Low',
          dueDate: '2024-10-10T13:377:00Z',
          listId: 2,
          listName: 'Done',
        },
        previousState: {
          name: 'Bar',
          description: '',
          priority: 'Low',
          dueDate: '2024-10-10T13:377:00Z',
          listId: 1,
          listName: 'Planned',
        },
      },
      {
        updatedAt: '2020-10-10T13:37:00Z',
        cardId: 1,
        currentState: {
          name: 'Bar',
          description: '',
          priority: 'Low',
          dueDate: '2024-10-10T13:377:00Z',
          listId: 1,
          listName: 'Planned',
        },
        previousState: {
          name: 'Foo',
          description: '',
          priority: 'Low',
          dueDate: '2024-10-10T13:377:00Z',
          listId: 1,
          listName: 'Planned',
        },
      },
      {
        updatedAt: '2020-10-10T13:37:00Z',
        cardId: 1,
        currentState: {
          name: 'Foo',
          description: '',
          priority: 'Low',
          dueDate: '2024-10-10T13:377:00Z',
          listId: 1,
          listName: 'Planned',
        },
        previousState: {
          name: 'Foo',
          description: '',
          priority: 'High',
          dueDate: '2024-10-10T13:377:00Z',
          listId: 1,
          listName: 'Planned',
        },
      },
      {
        updatedAt: '2020-10-10T13:37:00Z',
        cardId: 1,
        currentState: {
          name: 'Foo',
          description: '',
          priority: 'High',
          dueDate: '2024-10-10T13:37:00Z',
          listId: 1,
          listName: 'Planned',
        },
        previousState: {
          name: 'Foo',
          description: '',
          priority: 'Medium',
          dueDate: '2024-10-10T13:37:00Z',
          listId: 1,
          listName: 'Planned',
        },
      },
      {
        updatedAt: '2020-10-10T13:37:00Z',
        cardId: 1,
        currentState: {
          name: 'Foo',
          description: '',
          priority: 'Medium',
          dueDate: '2024-10-10T13:37:00Z',
          listId: 1,
          listName: 'Planned',
        },
      },
    ],
  },
};

export const Regular: Story = {
  decorators: [
    moduleMetadata({
      providers: [provideMockStore({ initialState })],
    }),
  ],
};

export const WithMoreItems: Story = {
  decorators: [
    moduleMetadata({
      providers: [
        provideMockStore({
          initialState: {
            boardChanges: {
              ...initialState.boardChanges,
              pageSize: 5,
              totalItems: 6,
            },
          },
        }),
      ],
    }),
  ],
};
