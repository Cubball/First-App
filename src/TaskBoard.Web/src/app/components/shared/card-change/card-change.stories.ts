import { Meta, StoryObj } from "@storybook/angular";
import { CardChangeComponent } from "./card-change.component";

const meta: Meta<CardChangeComponent> = {
  title: 'Shared/Card Change',
  component: CardChangeComponent,
  tags: ['autodocs'],
}

export default meta;

type Story = StoryObj<CardChangeComponent>;

export const Renamed: Story = {
  args: {
    cardChange: {
      updatedAt: new Date('2020-10-10T13:37:00Z'),
      changes: [
        {
          changeType: 'CardRenamed',
          from: 'Clean the room',
          to: 'Clean the house',
        }
      ]
    }
  }
}

export const Moved: Story = {
  args: {
    cardChange: {
      updatedAt: new Date('2020-10-10T13:37:00Z'),
      changes: [
        {
          changeType: 'CardMoved',
          name: 'Buy a new jacket',
          from: 'Planned',
          to: 'Done',
        }
      ]
    }
  }
}

export const Created: Story = {
  args: {
    cardChange: {
      updatedAt: new Date('2020-10-10T13:37:00Z'),
      changes: [
        {
          changeType: 'CardCreated',
          name: 'Buy a new jacket',
          listName: 'Planned',
        }
      ]
    }
  }
}

export const Deleted: Story = {
  args: {
    cardChange: {
      updatedAt: new Date('2020-10-10T13:37:00Z'),
      changes: [
        {
          changeType: 'CardDeleted',
          name: 'Buy a new jacket',
          listName: 'Done',
        }
      ]
    }
  }
}

export const Updated: Story = {
  args: {
    cardChange: {
      updatedAt: new Date('2020-10-10T13:37:00Z'),
      changes: [
        {
          changeType: 'CardUpdated',
          name: 'Buy a new jacket',
          fieldName: 'priority',
        }
      ]
    }
  }
}

export const UpdatedWithValues: Story = {
  args: {
    cardChange: {
      updatedAt: new Date('2020-10-10T13:37:00Z'),
      changes: [
        {
          changeType: 'CardUpdated',
          name: 'Buy a new jacket',
          fieldName: 'priority',
          from: 'Low',
          to: 'High',
        }
      ]
    }
  }
}

export const MultipleChanges: Story = {
  args: {
    cardChange: {
      updatedAt: new Date('2020-10-10T13:37:00Z'),
      changes: [
        {
          changeType: 'CardRenamed',
          from: 'Buy a new sweater',
          to: 'Buy a new jacket',
        },
        {
          changeType: 'CardMoved',
          from: 'Planned',
          to: 'Done',
        },
        {
          changeType: 'CardUpdated',
          fieldName: 'description',
        },
        {
          changeType: 'CardUpdated',
          fieldName: 'priority',
          from: 'Low',
          to: 'High',
        },
      ]
    }
  }
}
