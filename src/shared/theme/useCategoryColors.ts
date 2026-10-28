import { useId, useLayoutEffect } from 'react'
import { removeCategoryColors, setCategoryColors, type CategoryColor } from './categoryColors'

export function useCategoryColors(categories: CategoryColor[]) {
  const owner = useId()

  useLayoutEffect(() => {
    setCategoryColors(owner, categories)
    return () => removeCategoryColors(owner)
  }, [owner, categories])
}
