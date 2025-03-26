import { Main } from '@/components/layout/main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Reservations() {
  return (
    <>
      <Main>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold tracking-tight'>Reservations</h2>
          <p className='text-muted-foreground'>
            Manage your restaurant reservations
          </p>
        </div>

        <Tabs defaultValue='upcoming' className='w-full'>
          <TabsList className='mb-4'>
            <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
            <TabsTrigger value='past'>Past</TabsTrigger>
            <TabsTrigger value='calendar'>Calendar View</TabsTrigger>
          </TabsList>
          
          <TabsContent value='upcoming' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Today's Reservations</CardTitle>
                <CardDescription>Reservations scheduled for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='rounded-md border p-4'>
                    <div className='flex justify-between'>
                      <div>
                        <h4 className='font-medium'>John Smith</h4>
                        <p className='text-sm text-muted-foreground'>Table 5 • 4 people</p>
                      </div>
                      <div className='text-right'>
                        <p className='font-medium'>7:30 PM</p>
                        <p className='text-sm text-muted-foreground'>2 hours</p>
                      </div>
                    </div>
                    <div className='mt-2 text-sm'>
                      <p>Special request: Window seat if possible</p>
                    </div>
                  </div>

                  <div className='rounded-md border p-4'>
                    <div className='flex justify-between'>
                      <div>
                        <h4 className='font-medium'>Maria Garcia</h4>
                        <p className='text-sm text-muted-foreground'>Table 8 • 2 people</p>
                      </div>
                      <div className='text-right'>
                        <p className='font-medium'>8:00 PM</p>
                        <p className='text-sm text-muted-foreground'>1.5 hours</p>
                      </div>
                    </div>
                    <div className='mt-2 text-sm'>
                      <p>Anniversary celebration</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value='past' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Past Reservations</CardTitle>
                <CardDescription>History of previous reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This tab would display past reservations with details and status.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value='calendar' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Reservation Calendar</CardTitle>
                <CardDescription>View reservations in calendar format</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This tab would display a calendar view of all reservations.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
