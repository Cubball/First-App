import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CardComponent } from './card.component';
import { provideMockStore } from '@ngrx/store/testing';
import { BoardWithLists } from '../../../../types/shared/board-with-lists';
import { fn } from '@storybook/test';
import { CardInList } from '../../../../types/shared/card-in-list';

const initialState: { currentBoard: BoardWithLists } = {
  currentBoard: {
    id: 1,
    name: 'Board',
    lists: [
      {
        id: 1,
        name: 'Planned',
        cards: [],
      },
      {
        id: 2,
        name: 'Done',
        cards: [],
      },
    ],
  },
};

const meta: Meta<CardComponent> = {
  title: 'Card',
  component: CardComponent,
  tags: ['autodocs'],
  args: {
    onEditClick: fn(),
    onDeleteClick: fn(),
    onMoveToClick: fn(),
  },
  decorators: [
    moduleMetadata({
      providers: [
        provideMockStore({
          initialState,
        }),
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj<CardComponent>;

const card: CardInList = {
  id: 1,
  name: 'Clean the house',
  dueDate: '2020-10-10T13:37:00Z',
  priority: 'Low',
  description: '',
};

export const LowPriority: Story = {
  args: {
    card,
  },
};

export const MediumPriority: Story = {
  args: {
    card: {
      ...card,
      priority: 'Medium',
    },
  },
};

export const HighPriority: Story = {
  args: {
    card: {
      ...card,
      priority: 'High',
    },
  },
};

export const WithDescription: Story = {
  args: {
    card: {
      ...card,
      description:
        'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
    },
  },
};
