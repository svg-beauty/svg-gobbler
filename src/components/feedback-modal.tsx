import { useEffect, useRef, useState } from 'react'
import { serverEndpoint } from 'src/constants/server-config'
import { UserState, useDashboard, useUser } from 'src/providers'
import { loc } from 'src/utils/i18n'
import { logger } from 'src/utils/logger'
import { StorageUtils } from 'src/utils/storage-utils'

import { Button } from './button'
import { Modal } from './modal'

export const FeedbackModal = () => {
  const [open, setOpen] = useState(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const { dispatch, state: userState } = useUser()

  const {
    state: { collections },
  } = useDashboard()

  useEffect(() => {
    const installDate = new Date(userState.installDate).getTime()
    const currentDate = new Date().getTime()
    const daysInstalled = Math.floor((currentDate - installDate) / (1000 * 60 * 60 * 24))

    if (!userState.onboarding.viewedFeatureRequest && daysInstalled >= 5) {
      setTimeout(() => setOpen(true), 3000)
    }
  }, [collections.length, userState.onboarding.viewedFeatureRequest, userState.installDate])

  const setRequestModalViewed = () => {
    const payload: UserState = {
      ...userState,
      onboarding: {
        ...userState.onboarding,
        viewedFeatureRequest: true,
      },
    }
    StorageUtils.setStorageData('user', payload)
    dispatch({ payload, type: 'set-user' })
  }

  const onClose = () => {
    setRequestModalViewed()
    setOpen(false)
  }

  const handleRequestPrompt = async () => {
    const feedbackMessage = {
      payload: {
        feedback: textAreaRef.current?.value ?? '',
      },
      type: 'feedback',
    }

    try {
      fetch(serverEndpoint.svgr, {
        body: JSON.stringify(feedbackMessage),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
    } catch (error) {
      logger.error('Could not send feature request.', error)
    }

    onClose()
  }

  return (
    <Modal onClose={onClose} open={open} setOpen={setOpen}>
      <Modal.Header>👋 {loc('feedback_title')}</Modal.Header>
      <textarea
        className="input h-32"
        placeholder={loc('feedback_placeholder')}
        ref={textAreaRef}
      />
      <Modal.Footer>
        <Button onClick={handleRequestPrompt} size="lg">
          {loc('feedback_primary_action')}
        </Button>
        <Button onClick={onClose} size="lg" type="button" variant="secondary">
          {loc('feedback_secondary_action')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
