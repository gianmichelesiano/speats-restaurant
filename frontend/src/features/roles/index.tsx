import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RolesList } from './components/RolesList'
import { PermissionsList } from './components/PermissionsList'

export function RolesAndPermissions() {
  const [activeTab, setActiveTab] = useState('roles')

  return (
    <div className="container mx-auto py-6 space-y-6">

      <Tabs defaultValue="roles" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="roles">Ruoli</TabsTrigger>
          <TabsTrigger value="permissions">Permessi</TabsTrigger>
        </TabsList>
        <TabsContent value="roles" className="mt-6">
          <RolesList />
        </TabsContent>
        <TabsContent value="permissions" className="mt-6">
          <PermissionsList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
