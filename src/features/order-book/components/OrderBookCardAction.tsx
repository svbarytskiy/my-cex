import { ClickAwayListener } from 'common/components/ClickAwayListener/ClickAwayListener'
import { MoreHorizontal } from 'lucide-react'
import { useRef, useState } from 'react'
import { OrderBookSettingsForm } from './OrderBookSettingsForm'

export const OrderBookCardAction = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const buttonref = useRef<HTMLButtonElement>(null)

  return (
    <>
      <div className="h-full relative flex items-center cursor-pointer">
        <button
          className="h-10"
          ref={buttonref}
          onClick={() => setIsOpen(prev => !prev)}
        >
          <MoreHorizontal className="cursor-pointer w-5 h-5 text-text-secondary hover:text-text-primary" />
        </button>
        {isOpen && (
          <>
            <ClickAwayListener
              isOpen={isOpen}
              onOutsideClick={() => setIsOpen(false)}
              triggerRef={buttonref}
            >
              <OrderBookSettingsForm />
            </ClickAwayListener>
          </>
        )}
      </div>
    </>
  )
}
