import { Main } from '@/components/layout/main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Customers() {
  return (
    <>
      <Main>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold tracking-tight'>Customers</h2>
          <p className='text-muted-foreground'>
            View and manage your restaurant customers
          </p>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>View and manage customer information</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is a simple HTML page for customer management. You can add more complex functionality here.</p>
              <ul className='mt-4 list-disc pl-5'>
                <li>View customer profiles</li>
                <li>Edit customer information</li>
                <li>Track customer preferences</li>
                <li>Manage loyalty programs</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
              <CardDescription>Analyze customer behavior and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Track and analyze customer data to improve your service.</p>
              <ul className='mt-4 list-disc pl-5'>
                <li>Visit frequency</li>
                <li>Average spending</li>
                <li>Favorite dishes</li>
                <li>Demographic information</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Communication</CardTitle>
              <CardDescription>Engage with your customers</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Tools to communicate with your customers effectively.</p>
              <ul className='mt-4 list-disc pl-5'>
                <li>Email campaigns</li>
                <li>SMS notifications</li>
                <li>Special offers</li>
                <li>Birthday rewards</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
