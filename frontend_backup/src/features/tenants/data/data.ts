import { IconBuilding, IconBuildingCommunity, IconBuildingSkyscraper } from '@tabler/icons-react'

export const statuses = [
  {
    value: 'active',
    label: 'Active',
    icon: IconBuilding,
  },
  {
    value: 'inactive',
    label: 'Inactive',
    icon: IconBuildingCommunity,
  },
  {
    value: 'archived',
    label: 'Archived',
    icon: IconBuildingSkyscraper,
  },
]

export const types = [
  {
    value: 'business',
    label: 'Business',
  },
  {
    value: 'individual',
    label: 'Individual',
  },
  {
    value: 'organization',
    label: 'Organization',
  },
]
