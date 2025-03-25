import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Reviews() {
  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold tracking-tight'>Reviews</h2>
          <p className='text-muted-foreground'>
            Manage and respond to customer reviews
          </p>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>Latest feedback from your customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <div className='flex items-start space-x-4'>
                  <Avatar>
                    <AvatarImage src='/avatars/01.png' alt='Customer' />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className='flex-1 space-y-1'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='font-medium'>John Doe</p>
                        <div className='flex items-center'>
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <span className='text-sm text-muted-foreground'>2 days ago</span>
                    </div>
                    <p>
                      The food was amazing! I especially loved the pasta carbonara. The service was prompt and friendly.
                      Will definitely come back again.
                    </p>
                    <div className='flex justify-end space-x-2 pt-2'>
                      <button className='text-xs text-blue-600 hover:underline'>Reply</button>
                      <button className='text-xs text-muted-foreground hover:underline'>Mark as featured</button>
                    </div>
                  </div>
                </div>

                <div className='flex items-start space-x-4'>
                  <Avatar>
                    <AvatarImage src='/avatars/02.png' alt='Customer' />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div className='flex-1 space-y-1'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='font-medium'>Sarah Miller</p>
                        <div className='flex items-center'>
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${i < 3 ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <span className='text-sm text-muted-foreground'>1 week ago</span>
                    </div>
                    <p>
                      The food was good but the service was a bit slow. We had to wait for 20 minutes to get our drinks.
                      The ambiance was nice though.
                    </p>
                    <div className='flex justify-end space-x-2 pt-2'>
                      <button className='text-xs text-blue-600 hover:underline'>Reply</button>
                      <button className='text-xs text-muted-foreground hover:underline'>Mark as featured</button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Management</CardTitle>
              <CardDescription>Tools to manage customer feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is a simple HTML page for review management. You can add more complex functionality here.</p>
              <ul className='mt-4 list-disc pl-5'>
                <li>Respond to customer reviews</li>
                <li>Flag inappropriate content</li>
                <li>Feature positive reviews on your website</li>
                <li>Track review metrics and sentiment</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
