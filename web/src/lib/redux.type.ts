export type ApiState<T> = {
  loading: boolean;
  payload: T;
  successful: boolean;
  error: any;
};

export const ResetApiState = (payload: any) => ({
  loading: false,
  payload,
  successful: false,
  error: null,
});
