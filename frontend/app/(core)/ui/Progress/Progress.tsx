import { FC, HTMLAttributes } from 'react';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  current: number;
  goal: number;
  height?: number;
  measure?: string;
  showLabels?: boolean;
  showPercentage?: boolean;
  measurePosition?: 'left' | 'right';
}

const Progress: FC<ProgressProps> = ({
  current,
  goal,
  height = 32,
  measure = '',
  showLabels = true,
  showPercentage = true,
  measurePosition = 'left',
  ...props
}) => {
  return (
    <div {...props}>
      <div className='flex flex-col'>
        <div className='flex bg-rose-100 rounded overflow-hidden' style={{ height }}>
          <div
            className='flex bg-rose-600 rounded h-full items-center relative'
            style={{ width: `${(current / goal) * 100}%` }}
          >
            {showPercentage && (
              <span className='px-0.5 text-xs text-white relative rounded mx-auto font-bold'>
                {((current / goal) * 100).toFixed(2)}%
              </span>
            )}
          </div>
        </div>
        {showLabels && (
          <div className='flex justify-between text-xs mt-1 font-medium text-gray-500'>
            <span>
              {measurePosition === 'left'
                ? `${measure} ${current.toFixed(2)}`
                : `${current.toFixed(2)} ${measure}`}
            </span>
            <span>
              {measurePosition === 'left'
                ? `${measure} ${goal.toFixed(2)}`
                : `${goal.toFixed(2)} ${measure}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
