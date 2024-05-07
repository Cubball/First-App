export interface CardUpdated {
  changeType: 'CardUpdated';
  fieldName: string;
  name?: string;
  from?: string;
  to?: string;
}
