import React from 'react';
import clsx from 'clsx';

export default function Button({
  buttonLink = '#',
  buttonText = 'Shop Now',
  className,
  onClick,
}) {
  return (
    <a
      href={buttonLink}
      onClick={onClick}
      className={clsx(
        'rounded-xl bg-[#1A4C98] px-6 py-4 text-center text-xl font-bold uppercase tracking-wide text-white transition-all duration-200 hover:bg-[#123873] hover:scale-105 active:scale-95 shadow-lg shadow-[#1A4C98]/30 md:text-2xl cursor-pointer inline-block border border-[#00A3E0]/30',
        className
      )}
    >
      {buttonText}
    </a>
  );
}
