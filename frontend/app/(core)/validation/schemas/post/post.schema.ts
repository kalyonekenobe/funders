import { boolean, minLength, minValue, number, object, optional, string, toTrimmed } from 'valibot';

export const CreatePostSchema = object({
  title: string('Title cannot be empty', [toTrimmed(), minLength(1, 'Title cannot be empty')]),
  content: string('Content cannot be empty', [
    toTrimmed(),
    minLength(1, 'Content cannot be empty'),
  ]),
  fundsToBeRaised: number('Funds to be raised cannot be less than 0.01 USD', [
    minValue(0.01, 'Funds to be raised cannot be less than 0.01 USD'),
  ]),
  isDraft: optional(boolean()),
});

export const UpdatePostSchema = object({
  title: optional(
    string('Title cannot be empty', [toTrimmed(), minLength(1, 'Title cannot be empty')]),
  ),
  content: optional(
    string('Content cannot be empty', [toTrimmed(), minLength(1, 'Content cannot be empty')]),
  ),
  fundsToBeRaised: optional(
    number('Funds to be raised cannot be less than 0.01 USD', [
      minValue(0.01, 'Funds to be raised cannot be less than 0.01 USD'),
    ]),
  ),
  isDraft: optional(boolean()),
});
