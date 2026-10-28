import { useLayoutEffect } from 'react'
import { setCategoryColors, type CategoryColor } from './categoryColors'

export function useCategoryColors(categories: CategoryColor[]) {
  useLayoutEffect(() => {
    setCategoryColors(categories)
  }, [categories])
}
