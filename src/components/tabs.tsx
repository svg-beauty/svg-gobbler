import { Tab as HeadlessTab } from '@headlessui/react'
import clsx from 'clsx'
import { PropsWithChildren } from 'react'

const Group = (props: PropsWithChildren) => <HeadlessTab.Group {...props} />

const List = (props: PropsWithChildren) => (
  <HeadlessTab.List className="border-b border-gray-200 dark:border-gray-700" {...props} />
)

const Panels = (props: PropsWithChildren) => <HeadlessTab.Panels {...props} />

const Panel = (props: PropsWithChildren) => <HeadlessTab.Panel {...props} />

const Tab = (props: PropsWithChildren) => (
  <HeadlessTab
    {...props}
    className={clsx(
      'ui-selected:border-red-500 ui-selected:text-red-500 ui-selected:font-medium',
      'text-gray-600 ui-not-selected:dark:text-gray-400 hover:border-gray-200 border-transparent',
      'whitespace-nowrap border-b-2 py-1.5 px-3 text-sm',
    )}
  />
)

export const Tabs = {
  Group,
  List,
  Panels,
  Panel,
  Tab,
}
