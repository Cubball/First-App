import { CardCreated } from './card-created';
import { CardDeleted } from './card-deleted';
import { CardMoved } from './card-moved';
import { CardRenamed } from './card-renamed';
import { CardUpdated } from './card-updated';

export type FormattedCardChangeItem =
  | CardCreated
  | CardDeleted
  | CardMoved
  | CardRenamed
  | CardUpdated;
