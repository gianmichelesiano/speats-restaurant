import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rolesApi } from '@/utils/rolesApi'
import { Role } from '@/types/role.interface'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { MoreHorizontal, Plus, Pencil, Trash2, Shield } from 'lucide-react'

export function RolesList() {
  const queryClient = useQueryClient()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [newRole, setNewRole] = useState({ name: '', description: '' })

  // Query per ottenere tutti i ruoli
  const { data: roles, isLoading, error } = useQuery({
    queryKey: ['roles'],
    queryFn: rolesApi.getAllRoles,
  })

  // Mutation per creare un nuovo ruolo
  const createRoleMutation = useMutation({
    mutationFn: rolesApi.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setIsCreateDialogOpen(false)
      setNewRole({ name: '', description: '' })
      toast({
        title: 'Ruolo creato',
        description: 'Il ruolo è stato creato con successo',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: `Errore durante la creazione del ruolo: ${error}`,
      })
    },
  })

  // Mutation per aggiornare un ruolo
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: { name?: string; description?: string } }) =>
      rolesApi.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setIsEditDialogOpen(false)
      setSelectedRole(null)
      toast({
        title: 'Ruolo aggiornato',
        description: 'Il ruolo è stato aggiornato con successo',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: `Errore durante l'aggiornamento del ruolo: ${error}`,
      })
    },
  })

  // Mutation per eliminare un ruolo
  const deleteRoleMutation = useMutation({
    mutationFn: (id: string) => rolesApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setIsDeleteDialogOpen(false)
      setSelectedRole(null)
      toast({
        title: 'Ruolo eliminato',
        description: 'Il ruolo è stato eliminato con successo',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: `Errore durante l'eliminazione del ruolo: ${error}`,
      })
    },
  })

  const handleCreateRole = () => {
    if (!newRole.name) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Il nome del ruolo è obbligatorio',
      })
      return
    }
    createRoleMutation.mutate(newRole)
  }

  const handleUpdateRole = () => {
    if (!selectedRole) return
    
    const updateData: { name?: string; description?: string } = {}
    if (selectedRole.name) updateData.name = selectedRole.name
    if (selectedRole.description !== undefined) updateData.description = selectedRole.description
    
    updateRoleMutation.mutate({ id: selectedRole.id, role: updateData })
  }

  const handleDeleteRole = () => {
    if (!selectedRole) return
    deleteRoleMutation.mutate(selectedRole.id)
  }

  const handleEditClick = (role: Role) => {
    setSelectedRole(role)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (role: Role) => {
    setSelectedRole(role)
    setIsDeleteDialogOpen(true)
  }

  const handleViewPermissions = (role: Role) => {
    // Navigazione alla pagina dei permessi del ruolo
    window.location.href = `/_authenticated/roles/${role.id}/permissions`
  }

  if (isLoading) return <div>Caricamento ruoli...</div>
  if (error) return <div>Errore nel caricamento dei ruoli</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestione Ruoli</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nuovo Ruolo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crea Nuovo Ruolo</DialogTitle>
              <DialogDescription>
                Inserisci i dettagli per creare un nuovo ruolo nel sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descrizione
                </Label>
                <Textarea
                  id="description"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annulla
              </Button>
              <Button onClick={handleCreateRole} disabled={createRoleMutation.isPending}>
                {createRoleMutation.isPending ? 'Creazione...' : 'Crea Ruolo'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrizione</TableHead>
            <TableHead>Data Creazione</TableHead>
            <TableHead className="text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles && roles.length > 0 ? (
            roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description || '-'}</TableCell>
                <TableCell>{new Date(role.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Apri menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Azioni</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEditClick(role)}>
                        <Pencil className="mr-2 h-4 w-4" /> Modifica
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewPermissions(role)}>
                        <Shield className="mr-2 h-4 w-4" /> Gestisci Permessi
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(role)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Elimina
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Nessun ruolo trovato
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Dialog per la modifica */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica Ruolo</DialogTitle>
            <DialogDescription>
              Modifica i dettagli del ruolo selezionato.
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="edit-name"
                  value={selectedRole.name}
                  onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Descrizione
                </Label>
                <Textarea
                  id="edit-description"
                  value={selectedRole.description || ''}
                  onChange={(e) => setSelectedRole({ ...selectedRole, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleUpdateRole} disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? 'Aggiornamento...' : 'Aggiorna Ruolo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog per l'eliminazione */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Elimina Ruolo</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler eliminare questo ruolo? Questa azione non può essere annullata.
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="py-4">
              <p>
                Stai per eliminare il ruolo: <strong>{selectedRole.name}</strong>
              </p>
              {selectedRole.description && (
                <p className="text-sm text-muted-foreground mt-2">{selectedRole.description}</p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annulla
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRole}
              disabled={deleteRoleMutation.isPending}
            >
              {deleteRoleMutation.isPending ? 'Eliminazione...' : 'Elimina Ruolo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
