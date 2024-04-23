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
        <div className='flex bg-slate-100 rounded-full overflow-hidden' style={{ height }}>
          <div
            className='flex bg-emerald-500 rounded-full h-full items-center justify-center'
            style={{ width: `${(current / goal) * 100}%` }}
          >
            {showPercentage && (
              <span className='px-0.5 text-xs text-white absolute rounded-xl font-medium'>
                {((current / goal) * 100).toFixed(2)}%
              </span>
            )}
          </div>
        </div>
        {showLabels && (
          <div className='flex justify-between text-sm mt-1 font-medium text-gray-500'>
            <span>
              {measurePosition === 'left' ? `${measure} ${current}` : `${current} ${measure}`}
            </span>
            <span>{measurePosition === 'left' ? `${measure} ${goal}` : `${goal} ${measure}`}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
