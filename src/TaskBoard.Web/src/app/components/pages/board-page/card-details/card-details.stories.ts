import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CardDetailsComponent } from './card-details.component';
import { provideMockStore } from '@ngrx/store/testing';
import { selectLists } from '../../../../store/current-board/reducers';
import { selectCardState } from '../../../../store/card/reducers';
import { fn } from '@storybook/test';
import { selectCardChangesState } from '../../../../store/card-changes/reducers';
import { Card } from '../../../../types/shared/card';
import { CardChange } from '../../../../types/shared/card-change';
import { List } from '../../../../types/shared/list';

const mockCard: Card = {
  id: 1,
  name: 'Clean the house',
  description:
    'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
  dueDate: '2024-10-10T13:37:00Z',
  priority: 'Low',
  listId: 1,
  listName: 'Planned',
};

const mockChanges: CardChange[] = [
  {
    cardId: 1,
    updatedAt: '2024-10-10T13:37:00Z',
    previousState: {
      name: 'Clean the house',
      description:
        'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
      dueDate: '2024-10-10T13:37:00Z',
      priority: 'High',
      listId: 1,
      listName: 'Planned',
    },

    currentState: {
      name: 'Clean the house',
      description:
        'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
      dueDate: '2024-10-10T13:37:00Z',
      priority: 'Low',
      listId: 1,
      listName: 'Planned',
    },
  },
  {
    cardId: 1,
    updatedAt: '2024-10-10T13:37:00Z',
    currentState: {
      name: 'Clean the house',
      description:
        'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
      dueDate: '2024-10-10T13:37:00Z',
      priority: 'High',
      listId: 1,
      listName: 'Planned',
    },
  },
];

const mockLists: List[] = [
  {
    id: 1,
    name: 'Planned',
  },
  {
    id: 2,
    name: 'Done',
  },
];

const meta: Meta<CardDetailsComponent> = {
  title: 'Card Details',
  component: CardDetailsComponent,
  tags: ['autodocs'],
  args: {
    onMoveToSelect: fn(),
  },
  decorators: [
    moduleMetadata({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectLists,
              value: mockLists,
            },
            {
              selector: selectCardState,
              value: mockCard,
            },
            {
              selector: selectCardChangesState,
              value: mockChanges,
            },
          ],
        }),
      ],
    }),
  ],
};

export default meta;

export const CardDetails: StoryObj<CardDetailsComponent> = {};
