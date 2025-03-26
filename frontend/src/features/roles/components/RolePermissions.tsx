import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from '@tanstack/react-router'
import { rolesApi } from '@/utils/rolesApi'
import { permissionsApi } from '@/utils/permissionsApi'
import { Role } from '@/types/role.interface'
import { Permission } from '@/types/permission.interface'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

export function RolePermissions() {
  const { roleId } = useParams({ from: '/_authenticated/roles/$roleId/permissions' })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedPermissionId, setSelectedPermissionId] = useState<string>('')
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([])

  // Query per ottenere il ruolo
  const { data: role, isLoading: isRoleLoading } = useQuery({
    queryKey: ['role', roleId],
    queryFn: () => rolesApi.getRole(roleId),
  })

  // Query per ottenere i permessi del ruolo
  const {
    data: rolePermissions,
    isLoading: isPermissionsLoading,
    error: permissionsError,
  } = useQuery({
    queryKey: ['rolePermissions', roleId],
    queryFn: () => rolesApi.getRolePermissions(roleId),
  })

  // Query per ottenere tutti i permessi
  const { data: allPermissions, isLoading: isAllPermissionsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: permissionsApi.getAllPermissions,
  })

  // Aggiorna i permessi disponibili quando cambiano i dati
  useEffect(() => {
    if (allPermissions && rolePermissions) {
      // Filtra i permessi che non sono già assegnati al ruolo
      const rolePermissionIds = rolePermissions.map((p) => p.id)
      const available = allPermissions.filter((p) => !rolePermissionIds.includes(p.id))
      setAvailablePermissions(available)
    }
  }, [allPermissions, rolePermissions])

  // Mutation per assegnare un permesso a un ruolo
  const assignPermissionMutation = useMutation({
    mutationFn: ({ roleId, permissionId }: { roleId: string; permissionId: string }) =>
      rolesApi.assignPermissionToRole(roleId, permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rolePermissions', roleId] })
      setIsAddDialogOpen(false)
      setSelectedPermissionId('')
      toast({
        title: 'Permesso assegnato',
        description: 'Il permesso è stato assegnato con successo al ruolo',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: `Errore durante l'assegnazione del permesso: ${error}`,
      })
    },
  })

  // Mutation per rimuovere un permesso da un ruolo
  const removePermissionMutation = useMutation({
    mutationFn: ({ roleId, permissionId }: { roleId: string; permissionId: string }) =>
      rolesApi.removePermissionFromRole(roleId, permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rolePermissions', roleId] })
      toast({
        title: 'Permesso rimosso',
        description: 'Il permesso è stato rimosso con successo dal ruolo',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: `Errore durante la rimozione del permesso: ${error}`,
      })
    },
  })

  const handleAssignPermission = () => {
    if (!selectedPermissionId) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Seleziona un permesso da assegnare',
      })
      return
    }
    assignPermissionMutation.mutate({ roleId, permissionId: selectedPermissionId })
  }

  const handleRemovePermission = (permissionId: string) => {
    removePermissionMutation.mutate({ roleId, permissionId })
  }

  const handleBackToRoles = () => {
    // Utilizziamo window.location per la navigazione
    window.location.href = '/_authenticated/roles/'
  }

  if (isRoleLoading || isPermissionsLoading || isAllPermissionsLoading)
    return <div>Caricamento...</div>
  if (permissionsError) return <div>Errore nel caricamento dei permessi</div>
  if (!role) return <div>Ruolo non trovato</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={handleBackToRoles}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">
          Permessi del Ruolo: <span className="text-primary">{role.name}</span>
        </h2>
      </div>

      {role.description && (
        <p className="text-muted-foreground">{role.description}</p>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Permessi Assegnati</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Assegna Permesso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assegna Permesso al Ruolo</DialogTitle>
              <DialogDescription>
                Seleziona un permesso da assegnare al ruolo {role.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select
                value={selectedPermissionId}
                onValueChange={setSelectedPermissionId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona un permesso" />
                </SelectTrigger>
                <SelectContent>
                  {availablePermissions.length > 0 ? (
                    availablePermissions.map((permission) => (
                      <SelectItem key={permission.id} value={permission.id}>
                        {permission.name} ({permission.resource}.{permission.action})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      Nessun permesso disponibile
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Annulla
              </Button>
              <Button
                onClick={handleAssignPermission}
                disabled={assignPermissionMutation.isPending || !selectedPermissionId}
              >
                {assignPermissionMutation.isPending
                  ? 'Assegnazione...'
                  : 'Assegna Permesso'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Risorsa</TableHead>
            <TableHead>Azione</TableHead>
            <TableHead>Descrizione</TableHead>
            <TableHead className="text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rolePermissions && rolePermissions.length > 0 ? (
            rolePermissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell className="font-medium">{permission.name}</TableCell>
                <TableCell>{permission.resource}</TableCell>
                <TableCell>{permission.action}</TableCell>
                <TableCell>{permission.description || '-'}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePermission(permission.id)}
                    disabled={removePermissionMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Nessun permesso assegnato a questo ruolo
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
