import { minLength, object, string, toTrimmed } from 'valibot';

export const CreatePostCommentSchema = object({
  comment: string('Comment cannot be empty', [
    toTrimmed(),
    minLength(1, 'Comment cannot be empty'),
  ]),
});
