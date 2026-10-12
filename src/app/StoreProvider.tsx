import { useEffect, useReducer, type ReactNode } from 'react'
import { loadState, reducer, saveState, StoreContext } from './store.ts'

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  useEffect(() => saveState(state), [state])
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>
}
