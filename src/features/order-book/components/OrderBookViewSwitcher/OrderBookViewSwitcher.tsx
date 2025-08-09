import { FC } from 'react'

const Icons = {
  default: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="#EF454A" d="M2 3h6v6H2z" />
      <path fill="#20B26C" d="M2 11h6v6H2z" />
      <g fill="#fff" opacity="0.8">
        <path d="M10 3h8v2h-8zM10 7h8v2h-8zM10 11h8v2h-8zM10 15h8v2h-8z" />
      </g>
    </svg>
  ),

  bidsOnly: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="#20B26C" d="M2 3h6v14H2z" />
      <path
        fill="#fff"
        d="M10 3h8v2h-8zm0 4h8v2h-8zm0 4h8v2h-8zm0 4h8v2h-8z"
        opacity="0.8"
      />
    </svg>
  ),
  asksOnly: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="#EF454A" d="M2 3h6v14H2z" />
      <path
        fill="#fff"
        d="M10 3h8v2h-8zm0 4h8v2h-8zm0 4h8v2h-8zm0 4h8v2h-8z"
        opacity="0.8"
      />
    </svg>
  ),
}
interface OrderBookViewSwitcherProps {
  handleViewChange: (view: 'default' | 'bidsOnly' | 'asksOnly') => void
  activeView: 'default' | 'bidsOnly' | 'asksOnly'
}
export const OrderBookViewSwitcher: FC<OrderBookViewSwitcherProps> = ({
  handleViewChange,
  activeView,
}) => {
  return (
    <div className="flex gap-2 runded">
      {Object.entries(Icons).map(([key, icon]) => (
        <button
          key={key}
          className={`
            bg-transparent border-none cursor-pointer p-0.5 rounded opacity-60 transition-all duration-200
            hover:opacity-80 hover:bg-background-tertiary-hover
            ${activeView === key ? 'opacity-100' : ''}
          `}
          onClick={() =>
            handleViewChange(key as 'default' | 'bidsOnly' | 'asksOnly')
          }
          aria-label={`Switch to ${key} view`}
        >
          {icon}
        </button>
      ))}
    </div>
  )
}
