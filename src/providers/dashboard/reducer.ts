import type { Collection } from 'src/types'

export type DashboardState = {
  /**
   * Whether the sidebar is open or not in mobile contexts.
   */
  isOpen: boolean
  /**
   * The collections that are available to the user.
   */
  collections: Collection[]
}

export type DashboardAction =
  | { type: 'reset' }
  | { type: 'set-open'; payload: boolean }
  | { type: 'set-collections'; payload: Collection[] }

export const initDashboardState: DashboardState = {
  isOpen: false,
  collections: [],
}

export const dashboardReducer = (state: DashboardState, action: DashboardAction) => {
  switch (action.type) {
    case 'set-collections': {
      return { ...state, collections: action.payload }
    }

    case 'set-open': {
      return { ...state, isOpen: action.payload }
    }

    case 'reset': {
      return initDashboardState
    }

    default: {
      return initDashboardState
    }
  }
}
