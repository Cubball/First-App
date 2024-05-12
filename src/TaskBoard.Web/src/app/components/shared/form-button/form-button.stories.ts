import { Meta, StoryObj } from '@storybook/angular';
import { FormButtonComponent } from './form-button.component';
import { fn } from '@storybook/test';

const meta: Meta<FormButtonComponent> = {
  title: 'Shared/Button',
  component: FormButtonComponent,
  tags: ['autodocs'],
  args: {
    text: 'Click Me',
    buttonClick: fn(),
  }
};

export default meta;

type Story = StoryObj<FormButtonComponent>;

export const Primary: Story = {
  args: {
    style: 'Primary',
  }
}

export const Secondary: Story = {
  args: {
    style: 'Secondary',
  }
}
