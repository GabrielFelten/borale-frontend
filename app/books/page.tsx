"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookFormDialog } from "@/components/book-form-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Trash, Plus, Pencil } from "lucide-react"

export type Book = {
  id: number
  title: string
  genre: string
  author: string
  objectives: string[]
  status: boolean
}

const OBJECTIVE_OPTIONS = [
  { value: "Exchange", label: "Troca" },
  { value: "Donation", label: "Doação" },
  { value: "Loan", label: "Empréstimo" },
] as const


export default function MeusLivrosPage() {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingDialog, setIsLoadingDialog] = useState(false)

  useEffect(() => {
    const userId = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userId="))
      ?.split("=")[1]

    if (!userId) {
      router.push("/auth?mode=login")
      return
    }
  }, [router])

  useEffect(() => {
    fetchUserBooks()
  }, [])

  const fetchUserBooks = async () => {
    try {
      setIsLoading(true)

      const userId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userId="))
        ?.split("=")[1] || ""
      
      if (!userId) return;

      const params = new URLSearchParams({ userId });
      const response = await fetch(`https://boralebackend.onrender.com/api/Book/GetBookByUser?${params}`)
      const data = await response.json()
      setBooks(data)

    } catch (error) {
      console.error("Erro ao buscar livros:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddBook = () => {
    setEditingBook(null)
    setIsDialogOpen(true)
  }

  const handleEditBook = (book: Book) => {
    setEditingBook(book)
    setIsDialogOpen(true)
  }

  const handleSaveBook = async (bookData: Omit<Book, "id">) => {
    try {
      setIsLoadingDialog(true)

      const userId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userId="))
        ?.split("=")[1] || ""

      const baseUrl = "https://boralebackend.onrender.com";
      const response = await fetch(`${baseUrl}/api/Book/UpsertBook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Id: editingBook?.id || "",
          Title: bookData.title,
          Genre: bookData.genre,
          Author: bookData.author,
          Status: bookData.status,
          Objectives: bookData.objectives,
          IdUser: userId,
        }),
      });

      setIsDialogOpen(false)
      setEditingBook(null)
      setIsLoadingDialog(false)
      fetchUserBooks()
    } catch (error) {
      console.error("Erro ao salvar livro:", error)
    }
  }

  const handleDeleteBook = async (bookId: number) => {
    setIsLoadingDialog(true)
    try {
      const response = await fetch(`https://boralebackend.onrender.com/api/Book/DeleteBook?bookId=${bookId}`, {
        method: "DELETE",
      });
      setIsLoadingDialog(false)
      if (!response.ok) throw new Error("Erro ao excluir o livro");
      fetchUserBooks();
    } catch (error) {
      console.error(error);
      setIsLoadingDialog(false)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Gerenciamento de Livros</h1>
          <p className="text-muted-foreground">Gerencie sua coleção de livros disponíveis para a comunidade</p>
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <Button onClick={handleAddBook} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Livro
          </Button>
        </div>

        {/* Books Table */}
        <Card>
          <CardHeader>
            <CardTitle>Meus Livros</CardTitle>
            <CardDescription>Lista de todos os livros cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-muted-foreground mt-4">Carregando livros...</p>
              </div>
            ) : books.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead className="hidden md:table-cell">Gênero</TableHead>
                      <TableHead className="hidden md:table-cell">Objetivos</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium max-w-[180px] truncate">{book.title}</TableCell>
                        <TableCell className="hidden md:table-cell">{book.genre}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {book.objectives
                            .map((objective) => OBJECTIVE_OPTIONS.find(x => x.value === objective)?.label)
                            .join(", ")}
                        </TableCell>
                        <TableCell className="text-center flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditBook(book)}
                            className="p-1"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <ConfirmDialog onConfirm={() => handleDeleteBook(book.id)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Nenhum livro cadastrado ainda.</p>
                <p className="text-sm mt-2">Clique em "Adicionar Livro" para começar.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog */}
        <BookFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSaveBook}
          initialData={editingBook}
          isLoading={isLoadingDialog}
        />
      </div>
    </div>
  )
}