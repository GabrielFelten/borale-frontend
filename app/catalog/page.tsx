"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { BookCard } from "@/components/book-card"
import { SearchBar } from "@/components/search-bar"
import { FilterBar } from "@/components/filter-bar"

// Tipo para os livros
type Book = {
  id: number
  title: string
  genre: string
  objectives: string[]
  userName: string
  userPhone: string
  userEmail: string
  userCity: string
  userState: string
}

export default function CatalogoPage() {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState("")
  const [isLoading, setIsLoading] = useState(true)

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
    const fetchBooks = async () => {
      try {
        setIsLoading(true)

        const response = await fetch("https://boralebackend.onrender.com/api/Catalog/ListCatalogAsync")
        const data = await response.json()
        setBooks(data)

      } catch (error) {
        console.error("Erro ao buscar livros:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.userName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesObjectives =
      selectedObjectives.length === 0 || selectedObjectives.some((obj) => book.objectives.includes(obj))

    const matchesCity = !selectedCity || book.userCity === selectedCity.split("-")[0]

    return matchesSearch && matchesObjectives && matchesCity
  })

  const cities = Array.from(new Set(books.map((book) => `${book.userCity}-${book.userState}`)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Catálogo de Livros</h1>
          <p className="text-muted-foreground text-lg">Descubra livros disponíveis na comunidade</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <FilterBar
            selectedObjectives={selectedObjectives}
            onObjectivesChange={setSelectedObjectives}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            cities={cities}
          />
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredBooks.length} {filteredBooks.length === 1 ? "livro encontrado" : "livros encontrados"}
          </p>
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-muted-foreground mt-4">Carregando livros...</p>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nenhum livro encontrado com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  )
}