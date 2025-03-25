import React, { useState, useEffect } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { MenuItem } from '../data/schema'
import { menuItemsApi } from '@/utils/menuItemsApi'
import { toast } from '@/hooks/use-toast'

type MenuItemsDialogType = 'create' | 'update' | 'delete' | 'import'

interface MenuItemsContextType {
  open: MenuItemsDialogType | null
  setOpen: (str: MenuItemsDialogType | null) => void
  currentRow: MenuItem | null
  setCurrentRow: React.Dispatch<React.SetStateAction<MenuItem | null>>
  menuItems: MenuItem[]
  loading: boolean
  error: string | null
  selectedTenantId: string | null
  setSelectedTenantId: React.Dispatch<React.SetStateAction<string | null>>
  selectedRestaurantId: string | null
  setSelectedRestaurantId: React.Dispatch<React.SetStateAction<string | null>>
  selectedCategory: string | null
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>
  refreshMenuItems: () => Promise<void>
  createMenuItem: (menuItem: Omit<MenuItem, 'id'>) => Promise<void>
  updateMenuItem: (menuItemId: string, menuItem: Partial<Omit<MenuItem, 'id' | 'tenant_id' | 'restaurant_id'>>) => Promise<void>
  deleteMenuItem: (menuItemId: string) => Promise<void>
}

const MenuItemsContext = React.createContext<MenuItemsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function MenuItemsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<MenuItemsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<MenuItem | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null)
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const refreshMenuItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await menuItemsApi.getAllMenuItems(
        selectedTenantId || undefined, 
        selectedRestaurantId || undefined,
        selectedCategory || undefined
      )
      setMenuItems(data)
    } catch (err) {
      console.error('Error fetching menu items:', err)
      setError('Failed to load menu items. Please try again later.')
      toast({
        title: 'Error',
        description: 'Failed to load menu items. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const createMenuItem = async (menuItem: Omit<MenuItem, 'id'>) => {
    try {
      const newMenuItem = await menuItemsApi.createMenuItem(menuItem)
      setMenuItems((prevMenuItems) => [...prevMenuItems, newMenuItem])
      toast({
        title: 'Success',
        description: 'Menu item created successfully',
      })
    } catch (err) {
      console.error('Error creating menu item:', err)
      toast({
        title: 'Error',
        description: 'Failed to create menu item. Please try again.',
        variant: 'destructive',
      })
      throw err
    }
  }

  const updateMenuItem = async (menuItemId: string, menuItem: Partial<Omit<MenuItem, 'id' | 'tenant_id' | 'restaurant_id'>>) => {
    try {
      const updatedMenuItem = await menuItemsApi.updateMenuItem(menuItemId, menuItem)
      setMenuItems((prevMenuItems) =>
        prevMenuItems.map((r) => (r.id === menuItemId ? updatedMenuItem : r))
      )
      toast({
        title: 'Success',
        description: 'Menu item updated successfully',
      })
    } catch (err) {
      console.error('Error updating menu item:', err)
      toast({
        title: 'Error',
        description: 'Failed to update menu item. Please try again.',
        variant: 'destructive',
      })
      throw err
    }
  }

  const deleteMenuItem = async (menuItemId: string) => {
    try {
      await menuItemsApi.deleteMenuItem(menuItemId)
      setMenuItems((prevMenuItems) => prevMenuItems.filter((r) => r.id !== menuItemId))
      toast({
        title: 'Success',
        description: 'Menu item deleted successfully',
      })
    } catch (err) {
      console.error('Error deleting menu item:', err)
      toast({
        title: 'Error',
        description: 'Failed to delete menu item. Please try again.',
        variant: 'destructive',
      })
      throw err
    }
  }

  useEffect(() => {
    refreshMenuItems()
  }, [selectedTenantId, selectedRestaurantId, selectedCategory])

  return (
    <MenuItemsContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        menuItems,
        loading,
        error,
        selectedTenantId,
        setSelectedTenantId,
        selectedRestaurantId,
        setSelectedRestaurantId,
        selectedCategory,
        setSelectedCategory,
        refreshMenuItems,
        createMenuItem,
        updateMenuItem,
        deleteMenuItem,
      }}
    >
      {children}
    </MenuItemsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMenuItems = () => {
  const menuItemsContext = React.useContext(MenuItemsContext)

  if (!menuItemsContext) {
    throw new Error('useMenuItems has to be used within <MenuItemsContext>')
  }

  return menuItemsContext
}
