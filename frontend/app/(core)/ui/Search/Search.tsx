'use client';

import { FC, HTMLAttributes } from 'react';
import { SearchIcon } from '../Icons/Icons';

export interface SearchProps extends HTMLAttributes<HTMLDivElement> {
  onSearch?: (query: string) => void;
}

const Search: FC<SearchProps> = ({ onSearch, ...props }) => {
  return (
    <div {...props}>
      <input
        type='text'
        placeholder='Search'
        className='bg-transparent border-none rounded-l-full py-1.5 px-4 w-full z-10 text-gray-600 font-medium no-outline focus:outline focus:outline-transparent focus:ring-2 focus:ring-slate-300'
      />
      <span className='relative w-[1px] bg-gray-200 top-0 bottom-0 my-1'></span>
      <button
        type='button'
        className='px-3 py-2 focus:outline focus:outline-transparent focus:ring-2 focus:ring-slate-300 rounded-r-full z-10'
      >
        <SearchIcon className='size-5 stroke-2 text-gray-400' />
      </button>
    </div>
  );
};

export default Search;
