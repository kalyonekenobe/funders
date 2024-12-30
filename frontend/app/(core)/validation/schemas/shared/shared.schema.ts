import { pipe, string, transform, uuid } from 'valibot';

export const IdSchema = pipe(string(), uuid());
export const DateSchema = pipe(
  string(),
  transform(input => new Date(input)),
);
