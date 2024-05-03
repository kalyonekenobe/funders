import { PostComment } from '../store/types/post-comment.types';

export const getRootParentId = (
  comment: PostComment | undefined,
  comments: PostComment[],
): PostComment['id'] | undefined => {
  if (!comment) return comment;
  if (comment.parentCommentId === null) return comment.id;
  return getRootParentId(
    comments.find(c => c.id === comment.parentCommentId),
    comments,
  );
};

export const prepareComments = (comments: PostComment[]): PostComment[] => {
  const rootComments = comments
    .filter(comment => comment.parentCommentId === null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  rootComments.forEach(comment => {
    comment.replies = [];
    comments.forEach(c => {
      if (c.id !== comment.id && getRootParentId(c, comments) === comment.id) {
        c.parentComment = comments.find(cc => cc.id === c.parentCommentId);
        comment.replies!.push(c);
      }
    });
    comment.replies.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  });
  return rootComments;
};

export const flattenComments = (comments: PostComment[]): PostComment[] => {
  const result: PostComment[] = [];
  comments.forEach(comment => {
    result.push(comment);
    result.push(...flattenComments(comment.replies ?? []));
  });
  return result;
};
