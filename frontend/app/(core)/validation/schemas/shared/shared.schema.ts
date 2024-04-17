import { string, transform, uuid } from 'valibot';

export const IdSchema = string([uuid()]);
export const DateSchema = transform(string(), input => new Date(input));
