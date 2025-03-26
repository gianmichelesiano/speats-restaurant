import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Tables() {
  return (
    <>
      <Main>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold tracking-tight'>Tables</h2>
          <p className='text-muted-foreground'>
            Manage your restaurant tables and seating
          </p>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card className='bg-primary/5'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg'>Table 1</CardTitle>
              <CardDescription>Window • 4 seats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <span className='inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800'>
                  Available
                </span>
                <Button variant='outline' size='sm'>Assign</Button>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-destructive/5'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg'>Table 2</CardTitle>
              <CardDescription>Corner • 2 seats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <span className='inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800'>
                  Occupied
                </span>
                <Button variant='outline' size='sm'>View</Button>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-primary/5'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg'>Table 3</CardTitle>
              <CardDescription>Center • 6 seats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <span className='inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800'>
                  Available
                </span>
                <Button variant='outline' size='sm'>Assign</Button>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-yellow-500/5'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-lg'>Table 4</CardTitle>
              <CardDescription>Patio • 4 seats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex items-center justify-between'>
                <span className='inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800'>
                  Reserved
                </span>
                <Button variant='outline' size='sm'>View</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='mt-8'>
          <Card>
            <CardHeader>
              <CardTitle>Table Management</CardTitle>
              <CardDescription>Configure your restaurant's seating layout</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is a simple HTML page for table management. You can add more complex functionality here.</p>
              <ul className='mt-4 list-disc pl-5'>
                <li>Add, edit, or remove tables</li>
                <li>Configure table capacity and location</li>
                <li>Manage table availability</li>
                <li>View table reservation history</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
