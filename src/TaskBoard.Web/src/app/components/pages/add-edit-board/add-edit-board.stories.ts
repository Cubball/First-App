import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { AddEditBoardComponent } from './add-edit-board.component';
import { provideMockStore } from '@ngrx/store/testing';
import { fn } from '@storybook/test';

const meta: Meta<AddEditBoardComponent> = {
  title: 'Add Edit Board',
  component: AddEditBoardComponent,
  tags: ['autodocs'],
  args: {
    boardId: 1,
    onSaveClick: fn(),
    onCancelClick: fn(),
  },
  decorators: [
    moduleMetadata({
      providers: [provideMockStore({})],
    }),
  ],
};

export default meta;

export const AddEditBoard: StoryObj<AddEditBoardComponent> = {};
