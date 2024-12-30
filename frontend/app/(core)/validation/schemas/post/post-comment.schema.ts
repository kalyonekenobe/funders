import { minLength, pipe, strictObject, string, trim } from 'valibot';

export const CreatePostCommentSchema = strictObject({
  comment: pipe(string('Comment cannot be empty'), trim(), minLength(1, 'Comment cannot be empty')),
});

export const UpdatePostCommentSchema = strictObject({
  comment: pipe(string('Comment cannot be empty'), trim(), minLength(1, 'Comment cannot be empty')),
});
