import { FC, memo } from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  id: string;
  onClick: (label: string) => void;
}

const TabButton: FC<TabButtonProps> = memo(
  ({ label, isActive, id, onClick }) => {
    return (
      <button
        id={id}
        type="button"
        role="tab"
        aria-selected={isActive}
        className={`flex-shrink-0 py-2 mr-3 border-b-2 font-medium whitespace-nowrap transition-colors duration-200 ease-in-out
          ${isActive 
            ? 'text-white border-accent-primary ' 
            : 'text-gray-400 border-transparent hover:text-white'
          }`}
        onClick={() => onClick(label)}
      >
        {label}
      </button>
    );
  },
);

TabButton.displayName = 'TabButton';

export { TabButton };