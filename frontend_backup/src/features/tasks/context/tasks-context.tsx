import React, { useState, useEffect } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Task } from '../data/schema'
import { tasksApi } from '@/utils/tasksApi'
import { toast } from '@/hooks/use-toast'

type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

interface TasksContextType {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRow: Task | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Task | null>>
  tasks: Task[]
  loading: boolean
  error: string | null
  refreshTasks: () => Promise<void>
  createTask: (task: Omit<Task, 'id'>) => Promise<void>
  updateTask: (taskId: string, task: Omit<Task, 'id'>) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
}

const TasksContext = React.createContext<TasksContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function TasksProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Task | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const refreshTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await tasksApi.getAllTasks()
      setTasks(data)
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError('Failed to load tasks. Please try again later.')
      toast({
        title: 'Error',
        description: 'Failed to load tasks. Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (task: Omit<Task, 'id'>) => {
    try {
      const newTask = await tasksApi.createTask(task)
      setTasks((prevTasks) => [...prevTasks, newTask])
      toast({
        title: 'Success',
        description: 'Task created successfully',
      })
    } catch (err) {
      console.error('Error creating task:', err)
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      })
      throw err
    }
  }

  const updateTask = async (taskId: string, task: Omit<Task, 'id'>) => {
    try {
      const updatedTask = await tasksApi.updateTask(taskId, task)
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === taskId ? updatedTask : t))
      )
      toast({
        title: 'Success',
        description: 'Task updated successfully',
      })
    } catch (err) {
      console.error('Error updating task:', err)
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      })
      throw err
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      await tasksApi.deleteTask(taskId)
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId))
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      })
    } catch (err) {
      console.error('Error deleting task:', err)
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      })
      throw err
    }
  }

  useEffect(() => {
    refreshTasks()
  }, [])

  return (
    <TasksContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        tasks,
        loading,
        error,
        refreshTasks,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
  const tasksContext = React.useContext(TasksContext)

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }

  return tasksContext
}
