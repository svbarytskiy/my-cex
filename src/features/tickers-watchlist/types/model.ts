export type SortDirection = 'asc' | 'desc' | null
export interface SortableColumn {
  id: string
  label: string
  sortable: boolean
}

export interface SubTab {
  id: string
  label: string
}

export interface Tab {
  id: string
  label: string
  subTabs?: SubTab[]
}
