import {
  Meta,
  StoryObj,
  moduleMetadata,
} from '@storybook/angular';
import { HeaderComponent } from './header.component';
import { provideMockStore } from '@ngrx/store/testing';
import { Board } from '../../types/shared/board';

const initialState: { boards: Board[] } = {
  boards: [
    {
      id: 1,
      name: 'Chores',
    },
    {
      id: 2,
      name: 'Projects',
    },
  ],
};

const meta: Meta<HeaderComponent> = {
  title: 'Header',
  component: HeaderComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [provideMockStore({ initialState })],
    }),
  ],
};

export default meta;

export const Header: StoryObj<HeaderComponent> = {};
