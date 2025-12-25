'use client'

import { createContext, useContext, ReactNode } from 'react'

interface EditModeContextValue {
  editMode: boolean
  setEditMode: (value: boolean) => void
}

const EditModeContext = createContext<EditModeContextValue | null>(null)

export function useEditMode() {
  const context = useContext(EditModeContext)
  if (!context) {
    return { editMode: false, setEditMode: () => {} }
  }
  return context
}

interface EditModeProviderProps {
  children: ReactNode
  value: EditModeContextValue
}

export function EditModeProvider({ children, value }: EditModeProviderProps) {
  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  )
}
