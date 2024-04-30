import { FormattedCardChangeItem } from './formatted-card-change-item';

export interface FormattedCardChange {
  updatedAt: Date;
  changes: FormattedCardChangeItem[];
}
