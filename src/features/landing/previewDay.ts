import type { CategoryColor } from '@/shared/theme/categoryColors'

export const previewCategories: CategoryColor[] = [
  { id: 'preview-health', color: '#e08a5c' },
  { id: 'preview-studies', color: '#7b5cc4' },
]

export const previewActivities = [
  { time: '18:30', title: 'Academia', category: 'Saúde', duration: '1 h', categoryId: 'preview-health' },
  { time: '20:00', title: 'Estudar', category: 'Estudos', duration: '45 min', categoryId: 'preview-studies' },
]
