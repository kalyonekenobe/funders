import { FC } from 'react';

export interface IconProps extends React.SVGAttributes<SVGElement> {}

export const GoogleIcon: FC<IconProps> = props => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' fill='none' {...props}>
      <g clipPath='url(#a)'>
        <path
          fill='#4285F4'
          d='M24 19.636v9.295h12.916c-.567 2.989-2.27 5.52-4.822 7.222l7.79 6.043c4.537-4.188 7.155-10.341 7.155-17.65 0-1.702-.152-3.339-.436-4.91H24Z'
        />
        <path
          fill='#34A853'
          d='m10.55 28.568-1.757 1.345-6.219 4.843C6.524 42.59 14.617 48 24 48c6.48 0 11.913-2.138 15.884-5.804l-7.79-6.043c-2.138 1.44-4.865 2.313-8.094 2.313-6.24 0-11.541-4.211-13.44-9.884l-.01-.014Z'
        />
        <path
          fill='#FBBC05'
          d='M2.574 13.244A23.704 23.704 0 0 0 0 24c0 3.883.938 7.527 2.574 10.756 0 .022 7.986-6.196 7.986-6.196A14.384 14.384 0 0 1 9.796 24c0-1.593.284-3.12.764-4.56l-7.986-6.196Z'
        />
        <path
          fill='#EA4335'
          d='M24 9.556c3.534 0 6.676 1.222 9.185 3.579l6.873-6.873C35.89 2.378 30.48 0 24 0 14.618 0 6.523 5.39 2.574 13.244l7.986 6.196c1.898-5.673 7.2-9.884 13.44-9.884Z'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff' d='M0 0h48v48H0z' />
        </clipPath>
      </defs>
    </svg>
  );
};

export const DiscordIcon: FC<IconProps> = props => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' fill='none' {...props}>
      <g clipPath='url(#a)'>
        <path
          fill='#5865F2'
          d='M40.634 8.311a39.58 39.58 0 0 0-9.77-3.03.148.148 0 0 0-.157.074c-.422.75-.89 1.73-1.217 2.499a36.542 36.542 0 0 0-10.973 0 25.261 25.261 0 0 0-1.236-2.499.154.154 0 0 0-.157-.074 39.472 39.472 0 0 0-9.77 3.03.14.14 0 0 0-.064.055C1.067 17.663-.638 26.731.198 35.687a.165.165 0 0 0 .063.113c4.105 3.015 8.082 4.845 11.986 6.058a.155.155 0 0 0 .168-.055 28.448 28.448 0 0 0 2.452-3.988.152.152 0 0 0-.083-.212 26.217 26.217 0 0 1-3.745-1.784.154.154 0 0 1-.015-.256c.252-.188.504-.385.744-.583a.148.148 0 0 1 .155-.02c7.856 3.586 16.36 3.586 24.123 0a.148.148 0 0 1 .157.019c.24.198.492.396.745.584.087.065.082.2-.013.256A24.604 24.604 0 0 1 33.19 37.6a.153.153 0 0 0-.081.214 31.937 31.937 0 0 0 2.45 3.986.152.152 0 0 0 .168.057c3.922-1.213 7.9-3.043 12.005-6.058a.154.154 0 0 0 .062-.111c1.001-10.354-1.676-19.348-7.097-27.32a.122.122 0 0 0-.062-.058ZM16.04 30.234c-2.365 0-4.314-2.171-4.314-4.838 0-2.666 1.911-4.838 4.314-4.838 2.422 0 4.352 2.19 4.314 4.838 0 2.667-1.911 4.838-4.314 4.838Zm15.95 0c-2.365 0-4.314-2.171-4.314-4.838 0-2.666 1.91-4.838 4.314-4.838 2.421 0 4.351 2.19 4.313 4.838 0 2.667-1.892 4.838-4.313 4.838Z'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff' d='M0 0h48v48H0z' />
        </clipPath>
      </defs>
    </svg>
  );
};

export const OpenedEyeIcon: FC<IconProps> = props => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      {...props}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
      />
      <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' />
    </svg>
  );
};

export const ClosedEyeIcon: FC<IconProps> = props => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      {...props}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88'
      />
    </svg>
  );
};

export const InfoIcon: FC<IconProps> = props => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path
        fillRule='evenodd'
        d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z'
        clipRule='evenodd'
      />
    </svg>
  );
};

export const WarningIcon: FC<IconProps> = props => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path
        fillRule='evenodd'
        d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z'
        clipRule='evenodd'
      />
    </svg>
  );
};

export const ErrorIcon: FC<IconProps> = props => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path
        fillRule='evenodd'
        d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z'
        clipRule='evenodd'
      />
    </svg>
  );
};

export const SuccessIcon: FC<IconProps> = props => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path
        fillRule='evenodd'
        d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z'
        clipRule='evenodd'
      />
    </svg>
  );
};

export const CloseIcon: FC<IconProps> = props => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
      <path
        fillRule='evenodd'
        d='M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z'
        clipRule='evenodd'
      />
    </svg>
  );
};

export const BanknotesIcon: FC<IconProps> = props => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      {...props}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z'
      />
    </svg>
  );
};

export const SearchIcon: FC<IconProps> = props => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      {...props}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
      />
    </svg>
  );
};
