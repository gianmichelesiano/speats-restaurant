import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { permissionsApi } from '@/utils/permissionsApi'
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
import { MoreHorizontal, Plus, Pencil, Trash2 } from 'lucide-react'

export function PermissionsList() {
  const queryClient = useQueryClient()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [newPermission, setNewPermission] = useState({
    name: '',
    resource: '',
    action: '',
    description: '',
  })

  // Query per ottenere tutti i permessi
  const { data: permissions, isLoading, error } = useQuery({
    queryKey: ['permissions'],
    queryFn: permissionsApi.getAllPermissions,
  })

  // Mutation per creare un nuovo permesso
  const createPermissionMutation = useMutation({
    mutationFn: permissionsApi.createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      setIsCreateDialogOpen(false)
      setNewPermission({ name: '', resource: '', action: '', description: '' })
      toast({
        title: 'Permesso creato',
        description: 'Il permesso è stato creato con successo',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: `Errore durante la creazione del permesso: ${error}`,
      })
    },
  })

  // Mutation per aggiornare un permesso
  const updatePermissionMutation = useMutation({
    mutationFn: ({ id, permission }: { id: string; permission: any }) =>
      permissionsApi.updatePermission(id, permission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      setIsEditDialogOpen(false)
      setSelectedPermission(null)
      toast({
        title: 'Permesso aggiornato',
        description: 'Il permesso è stato aggiornato con successo',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: `Errore durante l'aggiornamento del permesso: ${error}`,
      })
    },
  })

  // Mutation per eliminare un permesso
  const deletePermissionMutation = useMutation({
    mutationFn: (id: string) => permissionsApi.deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      setIsDeleteDialogOpen(false)
      setSelectedPermission(null)
      toast({
        title: 'Permesso eliminato',
        description: 'Il permesso è stato eliminato con successo',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: `Errore durante l'eliminazione del permesso: ${error}`,
      })
    },
  })

  const handleCreatePermission = () => {
    if (!newPermission.name || !newPermission.resource || !newPermission.action) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: 'Nome, risorsa e azione sono campi obbligatori',
      })
      return
    }
    createPermissionMutation.mutate(newPermission)
  }

  const handleUpdatePermission = () => {
    if (!selectedPermission) return
    
    const updateData: any = {}
    if (selectedPermission.name) updateData.name = selectedPermission.name
    if (selectedPermission.resource) updateData.resource = selectedPermission.resource
    if (selectedPermission.action) updateData.action = selectedPermission.action
    if (selectedPermission.description !== undefined) updateData.description = selectedPermission.description
    
    updatePermissionMutation.mutate({ id: selectedPermission.id, permission: updateData })
  }

  const handleDeletePermission = () => {
    if (!selectedPermission) return
    deletePermissionMutation.mutate(selectedPermission.id)
  }

  const handleEditClick = (permission: Permission) => {
    setSelectedPermission(permission)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (permission: Permission) => {
    setSelectedPermission(permission)
    setIsDeleteDialogOpen(true)
  }

  if (isLoading) return <div>Caricamento permessi...</div>
  if (error) return <div>Errore nel caricamento dei permessi</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestione Permessi</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nuovo Permesso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crea Nuovo Permesso</DialogTitle>
              <DialogDescription>
                Inserisci i dettagli per creare un nuovo permesso nel sistema.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={newPermission.name}
                  onChange={(e) => setNewPermission({ ...newPermission, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="resource" className="text-right">
                  Risorsa
                </Label>
                <Input
                  id="resource"
                  value={newPermission.resource}
                  onChange={(e) => setNewPermission({ ...newPermission, resource: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="action" className="text-right">
                  Azione
                </Label>
                <Input
                  id="action"
                  value={newPermission.action}
                  onChange={(e) => setNewPermission({ ...newPermission, action: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descrizione
                </Label>
                <Textarea
                  id="description"
                  value={newPermission.description}
                  onChange={(e) => setNewPermission({ ...newPermission, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annulla
              </Button>
              <Button onClick={handleCreatePermission} disabled={createPermissionMutation.isPending}>
                {createPermissionMutation.isPending ? 'Creazione...' : 'Crea Permesso'}
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
          {permissions && permissions.length > 0 ? (
            permissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell className="font-medium">{permission.name}</TableCell>
                <TableCell>{permission.resource}</TableCell>
                <TableCell>{permission.action}</TableCell>
                <TableCell>{permission.description || '-'}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleEditClick(permission)}>
                        <Pencil className="mr-2 h-4 w-4" /> Modifica
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(permission)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Elimina
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Nessun permesso trovato
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Dialog per la modifica */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica Permesso</DialogTitle>
            <DialogDescription>
              Modifica i dettagli del permesso selezionato.
            </DialogDescription>
          </DialogHeader>
          {selectedPermission && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="edit-name"
                  value={selectedPermission.name}
                  onChange={(e) => setSelectedPermission({ ...selectedPermission, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-resource" className="text-right">
                  Risorsa
                </Label>
                <Input
                  id="edit-resource"
                  value={selectedPermission.resource}
                  onChange={(e) => setSelectedPermission({ ...selectedPermission, resource: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-action" className="text-right">
                  Azione
                </Label>
                <Input
                  id="edit-action"
                  value={selectedPermission.action}
                  onChange={(e) => setSelectedPermission({ ...selectedPermission, action: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Descrizione
                </Label>
                <Textarea
                  id="edit-description"
                  value={selectedPermission.description || ''}
                  onChange={(e) => setSelectedPermission({ ...selectedPermission, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleUpdatePermission} disabled={updatePermissionMutation.isPending}>
              {updatePermissionMutation.isPending ? 'Aggiornamento...' : 'Aggiorna Permesso'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog per l'eliminazione */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Elimina Permesso</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler eliminare questo permesso? Questa azione non può essere annullata.
            </DialogDescription>
          </DialogHeader>
          {selectedPermission && (
            <div className="py-4">
              <p>
                Stai per eliminare il permesso: <strong>{selectedPermission.name}</strong>
              </p>
              <p>
                <span className="font-medium">Risorsa:</span> {selectedPermission.resource}
              </p>
              <p>
                <span className="font-medium">Azione:</span> {selectedPermission.action}
              </p>
              {selectedPermission.description && (
                <p className="text-sm text-muted-foreground mt-2">{selectedPermission.description}</p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annulla
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePermission}
              disabled={deletePermissionMutation.isPending}
            >
              {deletePermissionMutation.isPending ? 'Eliminazione...' : 'Elimina Permesso'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
