import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { AddNewListComponent } from './add-new-list.component';
import { fn } from '@storybook/test';
import { provideMockStore } from '@ngrx/store/testing';

const meta: Meta<AddNewListComponent> = {
  title: 'Add New List',
  component: AddNewListComponent,
  tags: ['autodocs'],
  args: {
    onSaveNewListClick: fn(),
  },
  decorators: [
    moduleMetadata({
      providers: [provideMockStore({})],
    }),
  ],
};

export default meta;

export const AddNewList: StoryObj<AddNewListComponent> = {};
