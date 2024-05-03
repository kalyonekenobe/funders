import React, { useEffect, useRef } from 'react';

export const useOutsideClick = (callback: () => void): React.RefObject<HTMLDivElement> => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !ref.current.classList.contains('modal') &&
        !(
          (event.target as HTMLElement).closest('.modal') &&
          ref.current !== event.target &&
          !(event.target as HTMLElement).closest('.modal-close')
        )
      ) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
};
