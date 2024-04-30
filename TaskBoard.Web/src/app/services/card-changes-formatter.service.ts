import { Injectable } from '@angular/core';
import { CardChange } from '../types/shared/card-change';
import { FormattedCardChangeItem } from '../types/card-changes/formatted-card-change-item';
import { FormattedCardChange } from '../types/card-changes/formatted-card-change';

@Injectable({
  providedIn: 'root',
})
export class CardChangesFormatterService {
  getFormattedChange(cardChange: CardChange): FormattedCardChange {
    const changes = this.getFormattedChanges(cardChange);
    return {
      updatedAt: new Date(cardChange.updatedAt),
      changes,
    };
  }

  private getFormattedChanges(
    cardChange: CardChange,
  ): FormattedCardChangeItem[] {
    if (!cardChange.currentState) {
      return [
        {
          changeType: 'CardDeleted',
          name: cardChange.previousState!.name,
          listName: cardChange.previousState!.listName,
        },
      ];
    }

    if (!cardChange.previousState) {
      return [
        {
          changeType: 'CardCreated',
          name: cardChange.currentState.name,
          listName: cardChange.currentState.listName,
        },
      ];
    }

    return this.getFieldChanges(cardChange);
  }

  private getFieldChanges(cardChange: CardChange) {
    const changes: FormattedCardChangeItem[] = [];
    if (!cardChange.previousState || !cardChange.currentState) {
      return changes;
    }

    if (cardChange.currentState.name !== cardChange.previousState.name) {
      changes.push({
        changeType: 'CardRenamed',
        from: cardChange.previousState.name,
        to: cardChange.currentState.name,
      });
    }

    if (cardChange.currentState.listId !== cardChange.previousState.listId) {
      changes.push({
        changeType: 'CardMoved',
        name: changes.length === 0 ? cardChange.currentState.name : undefined,
        from: cardChange.previousState.listName,
        to: cardChange.currentState.listName,
      });
    }

    if (
      cardChange.currentState.priority !== cardChange.previousState.priority
    ) {
      changes.push({
        changeType: 'CardUpdated',
        name: changes.length === 0 ? cardChange.currentState.name : undefined,
        fieldName: 'priority',
        from: cardChange.previousState.priority,
        to: cardChange.currentState.priority,
      });
    }

    if (
      cardChange.currentState.description !==
      cardChange.previousState.description
    ) {
      changes.push({
        changeType: 'CardUpdated',
        name: changes.length === 0 ? cardChange.currentState.name : undefined,
        fieldName: 'description',
      });
    }

    if (cardChange.currentState.dueDate !== cardChange.previousState.dueDate) {
      changes.push({
        changeType: 'CardUpdated',
        name: changes.length === 0 ? cardChange.currentState.name : undefined,
        fieldName: 'due date',
      });
    }

    return changes;
  }
}
