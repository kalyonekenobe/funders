export interface PayloadAction<T = any> {
  type: string;
  payload: T;
}
