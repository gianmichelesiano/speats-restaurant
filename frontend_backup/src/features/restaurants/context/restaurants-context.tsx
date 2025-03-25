import React, { useState, useEffect } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Restaurant } from '../data/schema'
import { restaurantsApi } from '@/utils/restaurantsApi'
import { toast } from '@/hooks/use-toast'

type RestaurantsDialogType = 'create' | 'update' | 'delete' | 'import'

interface RestaurantsContextType {
  open: RestaurantsDialogType | null
  setOpen: (str: RestaurantsDialogType | null) => void
  currentRow: Restaurant | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Restaurant | null>>
  restaurants: Restaurant[]
  loading: boolean
  error: string | null
  selectedTenantId: string | null
  setSelectedTenantId: React.Dispatch<React.SetStateAction<string | null>>
  refreshRestaurants: () => Promise<void>
  createRestaurant: (restaurant: Omit<Restaurant, 'id'>) => Promise<void>
  updateRestaurant: (restaurantId: string, restaurant: Partial<Omit<Restaurant, 'id' | 'tenant_id'>>) => Promise<void>
  deleteRestaurant: (restaurantId: string) => Promise<void>
}

const RestaurantsContext = React.createContext<RestaurantsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function RestaurantsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<RestaurantsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Restaurant | null>(null)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null)

  const refreshRestaurants = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await restaurantsApi.getAllRestaurants(selectedTenantId || undefined)
      setRestaurants(data)
    } catch (err) {
      console.error('Error fetching restaurants:', err)
      setError('Failed to load restaurants. Please try again later.')
      toast({
        title: 'Error',
        description: 'Failed to load restaurants. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const createRestaurant = async (restaurant: Omit<Restaurant, 'id'>) => {
    try {
      const newRestaurant = await restaurantsApi.createRestaurant(restaurant)
      setRestaurants((prevRestaurants) => [...prevRestaurants, newRestaurant])
      toast({
        title: 'Success',
        description: 'Restaurant created successfully',
      })
    } catch (err) {
      console.error('Error creating restaurant:', err)
      toast({
        title: 'Error',
        description: 'Failed to create restaurant. Please try again.',
        variant: 'destructive',
      })
      throw err
    }
  }

  const updateRestaurant = async (restaurantId: string, restaurant: Partial<Omit<Restaurant, 'id' | 'tenant_id'>>) => {
    try {
      const updatedRestaurant = await restaurantsApi.updateRestaurant(restaurantId, restaurant)
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((r) => (r.id === restaurantId ? updatedRestaurant : r))
      )
      toast({
        title: 'Success',
        description: 'Restaurant updated successfully',
      })
    } catch (err) {
      console.error('Error updating restaurant:', err)
      toast({
        title: 'Error',
        description: 'Failed to update restaurant. Please try again.',
        variant: 'destructive',
      })
      throw err
    }
  }

  const deleteRestaurant = async (restaurantId: string) => {
    try {
      await restaurantsApi.deleteRestaurant(restaurantId)
      setRestaurants((prevRestaurants) => prevRestaurants.filter((r) => r.id !== restaurantId))
      toast({
        title: 'Success',
        description: 'Restaurant deleted successfully',
      })
    } catch (err) {
      console.error('Error deleting restaurant:', err)
      toast({
        title: 'Error',
        description: 'Failed to delete restaurant. Please try again.',
        variant: 'destructive',
      })
      throw err
    }
  }

  useEffect(() => {
    refreshRestaurants()
  }, [selectedTenantId])

  return (
    <RestaurantsContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        restaurants,
        loading,
        error,
        selectedTenantId,
        setSelectedTenantId,
        refreshRestaurants,
        createRestaurant,
        updateRestaurant,
        deleteRestaurant,
      }}
    >
      {children}
    </RestaurantsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRestaurants = () => {
  const restaurantsContext = React.useContext(RestaurantsContext)

  if (!restaurantsContext) {
    throw new Error('useRestaurants has to be used within <RestaurantsContext>')
  }

  return restaurantsContext
}
