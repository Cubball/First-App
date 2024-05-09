import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { AddEditCardComponent } from './add-edit-card.component';
import { provideMockStore } from '@ngrx/store/testing';
import { List } from '../../../../types/shared/list';
import { selectLists } from '../../../../store/current-board/reducers';
import { fn } from '@storybook/test';

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

const meta: Meta<AddEditCardComponent> = {
  title: 'Add Edit Card',
  component: AddEditCardComponent,
  tags: ['autodocs'],
  args: {
    onSaveClick: fn(),
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
          ],
        }),
      ],
    }),
  ],
};

export default meta;

export const AddEditCard: StoryObj<AddEditCardComponent> = {};
