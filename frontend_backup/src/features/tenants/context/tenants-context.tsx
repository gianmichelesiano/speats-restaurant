import React, { useState, useEffect } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Tenant } from '../data/schema'
import { tenantsApi } from '@/utils/tenantsApi'
import { toast } from '@/hooks/use-toast'

type TenantsDialogType = 'create' | 'update' | 'delete' | 'import'

interface TenantsContextType {
  open: TenantsDialogType | null
  setOpen: (str: TenantsDialogType | null) => void
  currentRow: Tenant | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Tenant | null>>
  tenants: Tenant[]
  loading: boolean
  error: string | null
  refreshTenants: () => Promise<void>
  createTenant: (tenant: Omit<Tenant, 'id'>) => Promise<void>
  updateTenant: (tenantId: string, tenant: Omit<Tenant, 'id'>) => Promise<void>
  deleteTenant: (tenantId: string) => Promise<void>
}

const TenantsContext = React.createContext<TenantsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function TenantsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<TenantsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Tenant | null>(null)
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const refreshTenants = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await tenantsApi.getAllTenants()
      setTenants(data)
    } catch (err) {
      console.error('Error fetching tenants:', err)
      setError('Failed to load tenants. Please try again later.')
      toast({
        title: 'Error',
        description: 'Failed to load tenants. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const createTenant = async (tenant: Omit<Tenant, 'id'>) => {
    try {
      const newTenant = await tenantsApi.createTenant(tenant)
      setTenants((prevTenants) => [...prevTenants, newTenant])
      toast({
        title: 'Success',
        description: 'Tenant created successfully',
      })
    } catch (err) {
      console.error('Error creating tenant:', err)
      toast({
        title: 'Error',
        description: 'Failed to create tenant. Please try again.',
        variant: 'destructive',
      })
      throw err
    }
  }

  const updateTenant = async (tenantId: string, tenant: Omit<Tenant, 'id'>) => {
    try {
      const updatedTenant = await tenantsApi.updateTenant(tenantId, tenant)
      setTenants((prevTenants) =>
        prevTenants.map((t) => (t.id === tenantId ? updatedTenant : t))
      )
      toast({
        title: 'Success',
        description: 'Tenant updated successfully',
      })
    } catch (err) {
      console.error('Error updating tenant:', err)
      toast({
        title: 'Error',
        description: 'Failed to update tenant. Please try again.',
        variant: 'destructive',
      })
      throw err
    }
  }

  const deleteTenant = async (tenantId: string) => {
    try {
      await tenantsApi.deleteTenant(tenantId)
      setTenants((prevTenants) => prevTenants.filter((t) => t.id !== tenantId))
      toast({
        title: 'Success',
        description: 'Tenant deleted successfully',
      })
    } catch (err) {
      console.error('Error deleting tenant:', err)
      toast({
        title: 'Error',
        description: 'Failed to delete tenant. Please try again.',
        variant: 'destructive',
      })
      throw err
    }
  }

  useEffect(() => {
    refreshTenants()
  }, [])

  return (
    <TenantsContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        tenants,
        loading,
        error,
        refreshTenants,
        createTenant,
        updateTenant,
        deleteTenant,
      }}
    >
      {children}
    </TenantsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTenants = () => {
  const tenantsContext = React.useContext(TenantsContext)

  if (!tenantsContext) {
    throw new Error('useTenants has to be used within <TenantsContext>')
  }

  return tenantsContext
}
