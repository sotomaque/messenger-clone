'use client';

import clsx from 'clsx';
import Link from 'next/link';
import type { IconType } from 'react-icons';

interface MobileItemProps {
  href: string;
  label: string;
  icon: IconType;
  active?: boolean;
  onClick?: () => void;
}

const MobileItem: React.FC<MobileItemProps> = ({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}) => {
  // Function(s)
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link
      onClick={handleClick}
      className={clsx(
        `
        group
        flex
        gap-x-3
        text-sm
        leading-6
        font-semibold
        w-full
        justify-center
        p-4
        text-gray-500
        hover:text-black
        hover:bg-gray-100
      `,
        active && 'bg-gray-100 text-black'
      )}
      href={href}
    >
      <Icon className="h-6 w-6" />
      <span className="sr-only">{label}</span>
    </Link>
  );
};

export default MobileItem;
