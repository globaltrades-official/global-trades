import React from 'react';
import clsx from 'clsx';

export const Bounded = ({
  as: Comp = 'section',
  className,
  children,
  ...restProps
}) => {
  return (
    <Comp
      className={clsx('px-4 first:pt-4 md:first:pt-6 md:px-8', className)}
      {...restProps}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
        {children}
      </div>
    </Comp>
  );
};
