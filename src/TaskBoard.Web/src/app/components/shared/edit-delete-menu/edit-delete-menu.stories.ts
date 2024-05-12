import { Meta, StoryObj } from "@storybook/angular";
import { EditDeleteMenuComponent } from "./edit-delete-menu.component";
import { fn } from "@storybook/test";

const meta: Meta<EditDeleteMenuComponent> = {
  title: 'Shared/Edit Delete Menu',
  component: EditDeleteMenuComponent,
  tags: ['autodocs'],
  args: {
    editClick: fn(),
    deleteClick: fn(),
  }
}

export default meta;

export const EditDeleteMenu: StoryObj<EditDeleteMenuComponent> = {};
