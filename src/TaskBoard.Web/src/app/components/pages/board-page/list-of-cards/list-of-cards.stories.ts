import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ListOfCardsComponent } from './list-of-cards.component';
import { provideMockStore } from '@ngrx/store/testing';
import { fn } from '@storybook/test';

const meta: Meta<ListOfCardsComponent> = {
  title: 'List of Cards',
  component: ListOfCardsComponent,
  tags: ['autodocs'],
  args: {
    onSaveClick: fn(),
    onDeleteClick: fn(),
  },
  decorators: [
    moduleMetadata({
      providers: [provideMockStore({ initialState: {} })],
    }),
  ],
};

export default meta;

type Story = StoryObj<ListOfCardsComponent>;

export const WithCards: Story = {
  args: {
    list: {
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
          id: 2,
          name: 'Get groceries',
          dueDate: '2024-10-10T13:37:00Z',
          description: 'Milk, bread, fruits, coffee',
          priority: 'High',
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
  },
};

export const Empty: Story = {
  args: {
    list: {
      id: 2,
      name: 'Done',
      cards: [],
    }
  }
}
