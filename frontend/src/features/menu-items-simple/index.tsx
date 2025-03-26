import { Main } from '@/components/layout/main'

export default function MenuItemsSimple() {
  return (
    <>
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Menu Items (Simple)</h2>
            <p className='text-muted-foreground'>
              A simple menu items page with basic HTML
            </p>
          </div>
        </div>
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Menu Items Content</h2>
          <p>This is a simple menu items page with basic HTML.</p>
        </div>
      </Main>
    </>
  )
}
