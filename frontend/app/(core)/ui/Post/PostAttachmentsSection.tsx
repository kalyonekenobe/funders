'use client';

import { FC, HTMLAttributes, useEffect, useState } from 'react';
import { PostAttachment } from '../../store/types/post-attachment.types';
import { getFileExtension, resolveFilePath } from '../../utils/app.utils';
import { FileIcon } from '../Icons/Icons';

export interface PostAttachmentsSectionProps extends HTMLAttributes<HTMLDivElement> {
  attachments: PostAttachment[];
}

export interface PostAttachmentsSectionState {
  attachments: PostAttachment[];
}

const initialState: PostAttachmentsSectionState = {
  attachments: [],
};

const PostAttachmentsSection: FC<PostAttachmentsSectionProps> = ({ attachments, ...props }) => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    setState({ ...state, attachments });
  }, []);

  return (
    <div {...props}>
      <h4 className='text-gray-500 font-bold text-xl mb-5'>Attachments</h4>
      {(state.attachments.length ?? 0) > 0 ? (
        <div className='text-gray-500 font-medium inline-flex p-3 rounded border-[3px] border-dashed gap-1 flex-wrap'>
          {state.attachments.map(attachment => (
            <span
              onClick={() => {
                fetch(
                  resolveFilePath(
                    attachment.file,
                    attachment.resourceType as 'image' | 'video' | 'raw',
                  ),
                )
                  .then(response => response.blob())
                  .then(blob => {
                    const url = window.URL.createObjectURL(new Blob([blob]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute(
                      'download',
                      `${attachment.filename || attachment.file}${
                        getFileExtension(attachment.file)
                          ? `.${getFileExtension(attachment.file)}`
                          : ''
                      }`,
                    );
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode?.removeChild(link);
                  });
              }}
              key={attachment.id}
              className='inline-flex text-center items-center justify-center border bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded cursor-pointer transition-[0.3s_ease] text-slate-600 font-medium'
            >
              <FileIcon className='size-3 stroke-2 me-1' />
              {attachment.filename || attachment.file}
            </span>
          ))}
        </div>
      ) : (
        <h4 className='text-gray-500 font-medium text-center inline-flex justify-center items-center py-3 px-10 rounded border-[3px] border-dashed'>
          No attachments have been added to this post yet
        </h4>
      )}
    </div>
  );
};

export default PostAttachmentsSection;
