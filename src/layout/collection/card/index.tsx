import clsx from 'clsx'
import { HTMLAttributes, forwardRef } from 'react'
import { PresentationSvg } from 'scripts/svg-classes/presentation-svg'
import { useCollection } from 'src/providers'
import { CardContent } from './card-content'
import { CardSelect } from './card-select'

export type CardProps = HTMLAttributes<HTMLLIElement> & {
  data: PresentationSvg
}

export const Card = forwardRef<HTMLLIElement, CardProps>((props, ref) => {
  const { data, ...rest } = props
  const { state } = useCollection()

  return (
    <li
      {...rest}
      ref={ref}
      className={clsx(
        'relative rounded-2xl text bg-white dark:bg-gray-800/50 ',
        'transition-all duration-300 ease-in-out group',
        'flex items-center justify-center aspect-square',
      )}
    >
      <CardSelect />
      <div
        className={`relative shrink-0 overflow-hidden transition-all duration-300 ease-in`}
        style={{ height: state.view.size, width: state.view.size }}
      >
        <CardContent data={data} />
      </div>
    </li>
  )
})
