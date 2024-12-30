import {
  boolean,
  minLength,
  minValue,
  number,
  optional,
  pipe,
  strictObject,
  string,
  trim,
} from 'valibot';

export const CreatePostSchema = strictObject({
  title: pipe(string('Title cannot be empty'), trim(), minLength(1, 'Title cannot be empty')),
  content: pipe(string('Content cannot be empty'), trim(), minLength(1, 'Content cannot be empty')),
  fundsToBeRaised: pipe(
    number('Funds to be raised cannot be less than 0.01 USD'),
    minValue(0.01, 'Funds to be raised cannot be less than 0.01 USD'),
  ),
  isDraft: optional(pipe(boolean())),
});

export const UpdatePostSchema = strictObject({
  title: optional(
    pipe(string('Title cannot be empty'), trim(), minLength(1, 'Title cannot be empty')),
  ),
  content: optional(
    pipe(string('Content cannot be empty'), trim(), minLength(1, 'Content cannot be empty')),
  ),
  fundsToBeRaised: optional(
    pipe(
      number('Funds to be raised cannot be less than 0.01 USD'),
      minValue(0.01, 'Funds to be raised cannot be less than 0.01 USD'),
    ),
  ),
  isDraft: optional(boolean()),
});
