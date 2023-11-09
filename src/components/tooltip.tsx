import * as RTooltip from '@radix-ui/react-tooltip'
import clsx from 'clsx'
import { PropsWithChildren } from 'react'

type TooltipProps = {
  /**
   * The content of the tooltip.
   */
  content: string
  /**
   * The side the tooltip will render in relation to the trigger element.
   * Defaults to 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export const Tooltip = ({
  children,
  content,
  side = 'bottom',
}: PropsWithChildren<TooltipProps>) => (
  <RTooltip.Provider>
    <RTooltip.Root delayDuration={300}>
      <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
      <RTooltip.Portal>
        <RTooltip.Content
          side={side}
          sideOffset={4}
          className={clsx(
            'radix-side-top:animate-slide-down-fade',
            'radix-side-right:animate-slide-left-fade',
            'radix-side-bottom:animate-slide-up-fade',
            'radix-side-left:animate-slide-right-fade',
            'inline-flex items-center rounded-lg px-4 py-3',
            'bg-gray-800 dark:bg-white shadow-md text-xs',
            'text-white dark:text-gray-800 max-w-[16rem]',
          )}
        >
          {content}
          <RTooltip.Arrow className="fill-current text-gray-800 dark:text-gray-200" />
        </RTooltip.Content>
      </RTooltip.Portal>
    </RTooltip.Root>
  </RTooltip.Provider>
)
