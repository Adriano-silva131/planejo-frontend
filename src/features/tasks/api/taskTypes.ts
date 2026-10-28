import type { components } from '@/shared/api/schema'

export type TaskFields = components['schemas']['TaskFields']
// O OpenAPI ainda não descreve os campos embutidos em TaskBody, mas a resposta traz TaskFields no mesmo nível.
export type Task = components['schemas']['TaskBody'] & TaskFields
export type TaskPage = { data: Task[] | null; meta: components['schemas']['PageMeta'] }
export type TaskArea = components['schemas']['AreaBody']
export type TaskKind = TaskFields['kind']
export type Weekday = NonNullable<TaskFields['weekdays']>[number]
export type Priority = NonNullable<TaskFields['priority']>
export type Period = NonNullable<TaskFields['period']>
