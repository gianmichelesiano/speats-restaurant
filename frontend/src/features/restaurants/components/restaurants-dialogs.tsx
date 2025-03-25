import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useRestaurants } from '../context/restaurants-context'
import { restaurantSchema } from '../data/schema'
import { useTenants } from '@/features/tenants/context/tenants-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const createRestaurantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().optional(),
  opening_hours: z.string().optional(),
  logo_image: z.string().optional(),
  description: z.string().optional(),
  tenant_id: z.string().min(1, 'Tenant is required'),
})

const updateRestaurantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().optional(),
  opening_hours: z.string().optional(),
  logo_image: z.string().optional(),
  description: z.string().optional(),
})

type CreateRestaurantFormValues = z.infer<typeof createRestaurantSchema>
type UpdateRestaurantFormValues = z.infer<typeof updateRestaurantSchema>

export function RestaurantsDialogs() {
  const { open, setOpen, currentRow, createRestaurant, updateRestaurant, deleteRestaurant } = useRestaurants()
  const { tenants } = useTenants()

  // Create form
  const createForm = useForm<CreateRestaurantFormValues>({
    resolver: zodResolver(createRestaurantSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      opening_hours: '',
      logo_image: '',
      description: '',
      tenant_id: '',
    },
  })

  // Update form
  const updateForm = useForm<UpdateRestaurantFormValues>({
    resolver: zodResolver(updateRestaurantSchema),
    defaultValues: {
      name: currentRow?.name || '',
      address: currentRow?.address || '',
      phone: currentRow?.phone || '',
      opening_hours: currentRow?.opening_hours || '',
      logo_image: currentRow?.logo_image || '',
      description: currentRow?.description || '',
    },
  })

  // Reset forms when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(null)
      createForm.reset()
      updateForm.reset()
    }
  }

  // Update form values when currentRow changes
  React.useEffect(() => {
    if (currentRow && open === 'update') {
      // Use setTimeout to avoid React state update conflicts
      setTimeout(() => {
        updateForm.reset({
          name: currentRow.name,
          address: currentRow.address,
          phone: currentRow.phone || '',
          opening_hours: currentRow.opening_hours || '',
          logo_image: currentRow.logo_image || '',
          description: currentRow.description || '',
        });
      }, 0);
    }
  }, [currentRow, open]);

  // Handle create form submission
  const onCreateSubmit = async (data: CreateRestaurantFormValues) => {
    try {
      await createRestaurant(data)
      setOpen(null)
      createForm.reset()
    } catch (error) {
      console.error('Error creating restaurant:', error)
    }
  }

  // Handle update form submission
  const onUpdateSubmit = async (data: UpdateRestaurantFormValues) => {
    if (!currentRow) return

    try {
      await updateRestaurant(currentRow.id, data)
      setOpen(null)
      updateForm.reset()
    } catch (error) {
      console.error('Error updating restaurant:', error)
    }
  }

  // Handle delete
  const onDelete = async () => {
    if (!currentRow) return

    try {
      await deleteRestaurant(currentRow.id)
      setOpen(null)
    } catch (error) {
      console.error('Error deleting restaurant:', error)
    }
  }

  return (
    <>
      {/* Create Dialog */}
      <Dialog open={open === 'create'} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Create Restaurant</DialogTitle>
            <DialogDescription>
              Add a new restaurant to the system.
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className='space-y-4'>
              <FormField
                control={createForm.control}
                name='tenant_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenant</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a tenant' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tenants.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.id}>
                            {tenant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Restaurant name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder='Restaurant address' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder='Phone number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name='opening_hours'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Hours</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g. Mon-Fri: 9AM-5PM' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name='logo_image'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder='Logo image URL' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Restaurant description'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type='submit'>Create</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={open === 'update'} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit Restaurant</DialogTitle>
            <DialogDescription>
              Update restaurant information.
            </DialogDescription>
          </DialogHeader>
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className='space-y-4'>
              <FormField
                control={updateForm.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Restaurant name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder='Restaurant address' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder='Phone number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name='opening_hours'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Hours</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g. Mon-Fri: 9AM-5PM' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name='logo_image'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder='Logo image URL' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateForm.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Restaurant description'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type='submit'>Update</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={open === 'delete'} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Delete Restaurant</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this restaurant? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={onDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
