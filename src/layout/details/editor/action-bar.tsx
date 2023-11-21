import { ArrowRightIcon, BoltIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useMemo } from 'react'
import { useDetails } from 'src/providers'
import { SvgUtils } from 'src/utils/svg-utils'
import { useOptimize } from '../use-optimize'

export const ActionBar = () => {
  const { state, dispatch } = useDetails()
  const { format, optimize } = useOptimize()

  const onOptimize = () => {
    dispatch({ type: 'update-current-string', payload: optimize(state.currentString) })
  }

  const onFormat = () => {
    const formatted = format(state.currentString)
    dispatch({ type: 'update-current-string', payload: formatted })
  }

  const bytes = useMemo(() => {
    return {
      before: SvgUtils.getPrettyBytes(state.originalString),
      after: SvgUtils.getPrettyBytes(state.currentString),
    }
  }, [state.currentString, state.originalString])

  return (
    <div className="flex h-14 items-center justify-between bg-[#24283b] px-4 text-white">
      <button className="editor-btn" onClick={onOptimize}>
        <BoltIcon className="h-4 w-4 opacity-50" />
        Optimize
      </button>
      <span className="flex items-center gap-2 text-center">
        {bytes.before} <ArrowRightIcon className="inline h-2.5 w-2.5" /> {bytes.after}
      </span>
      <button className="editor-btn" onClick={onFormat}>
        <SparklesIcon className="h-4 w-4 opacity-50" />
        Format
      </button>
    </div>
  )
}
