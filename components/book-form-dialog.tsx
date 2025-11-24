"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import type { Book } from "@/app/books/page"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

type BookFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (book: Omit<Book, "id">) => void
  initialData?: Book | null,
  isLoading: boolean
}

const OBJECTIVE_OPTIONS = [
  { value: "Exchange", label: "Troca" },
  { value: "Donation", label: "Doação" },
  { value: "Loan", label: "Empréstimo" },
] as const

type FeedbackType = "success" | "error" | null

export function BookFormDialog({ open, onOpenChange, onSave, initialData, isLoading }: BookFormDialogProps) {
  const [title, setTitle] = useState("")
  const [genre, setGenre] = useState("")
  const [author, setAuthor] = useState("")
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([])
  const [status, setStatus] = useState(true)
  const [feedback, setFeedback] = useState<{ type: FeedbackType; message: string }>({
    type: null,
    message: "",
  })

  useEffect(() => {
    setFeedback({ type: null, message: "" })
    if (initialData) {
      setTitle(initialData.title)
      setGenre(initialData.genre)
      setAuthor(initialData.author)
      setSelectedObjectives(initialData.objectives)
      setStatus(initialData.status)
    } else {
      setTitle("")
      setGenre("")
      setAuthor("")
      setSelectedObjectives([])
      setStatus(true)
    }
  }, [initialData, open])

  const toggleObjective = (objective: string) => {
    setSelectedObjectives((prev) =>
      prev.includes(objective) ? prev.filter((obj) => obj !== objective) : [...prev, objective],
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setFeedback({ type: null, message: "" })

    if (!title || title.trim() === "") {
      setFeedback({
        type: "error",
        message: "Por favor, preencha o campo Título",
      })
      return
    }

    if (!genre || genre.trim() === "") {
      setFeedback({
        type: "error",
        message: "Por favor, preencha o campo Gênero",
      })
      return
    }

    if (!author || author.trim() === "") {
      setFeedback({
        type: "error",
        message: "Por favor, preencha o campo Autor",
      })
      return
    }

    if (selectedObjectives.length === 0) {
      setFeedback({ type: "error", message: "Selecione ao menos um objetivo para o livro." })
      return
    }

    onSave({ title, genre, author, objectives: selectedObjectives, status })
    setTitle("")
    setGenre("")
    setAuthor("")
    setSelectedObjectives([])
    setStatus(true)
  }

  const isEditing = !!initialData

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Livro" : "Adicionar Novo Livro"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações do livro abaixo."
              : "Preencha as informações do livro que deseja adicionar."}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-muted-foreground mt-4">Salvando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Ex: O Pequeno Príncipe"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  placeholder="Autor do livro"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="genre">Gênero</Label>
                <Input
                  id="genre"
                  placeholder="Ex: Ficção, Romance, Fantasia"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label>Objetivos</Label>
                <div className="space-y-3">
                  {OBJECTIVE_OPTIONS.map((objective) => (
                    <div key={objective.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={objective.value}
                        checked={selectedObjectives.includes(objective.value)}
                        onCheckedChange={() => toggleObjective(objective.value)}
                      />
                      <label
                        htmlFor={objective.value}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {objective.label}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Selecione um ou mais objetivos para o livro</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="status" className="text-base">
                    Status do Livro
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {status ? "Livro ativo e visível no catálogo" : "Livro desativado e oculto"}
                  </p>
                </div>
                <Switch id="status" checked={status} onCheckedChange={setStatus} />
              </div>
              {feedback.type && (
                <Alert
                  variant={feedback.type === "error" ? "destructive" : "default"}
                  className={feedback.type === "success" ? "bg-success/10 text-success border-success/20" : ""}
                >
                  {feedback.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <AlertDescription>{feedback.message}</AlertDescription>
                </Alert>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">{isEditing ? "Salvar Alterações" : "Adicionar Livro"}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}