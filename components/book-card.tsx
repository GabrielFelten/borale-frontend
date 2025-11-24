import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Book, Mail, Phone, MapPin, ExternalLink } from "lucide-react"

interface BookCardProps {
  book: {
    id: number
    title: string
    genre: string
    author: string
    objectives: string[]
    userName: string
    userPhone: string
    userEmail: string
    userCity: string
    userState: string
    userStreet: string
    userNumber: string
    userNeighborhood: string
    userPublicContact: boolean
  }
}

const objectiveLabels: Record<string, string> = {
  Exchange: "Troca",
  Donation: "Doação",
  Loan: "Empréstimo",
}

const objectiveColors: Record<string, string> = {
  Exchange: "bg-primary/10 text-primary hover:bg-primary/20",
  Donation: "bg-green-100 text-green-700 hover:bg-green-200",
  Loan: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
}

export function BookCard({ book }: BookCardProps) {
  const fullAddress =
    book.userStreet &&
    book.userNumber &&
    book.userNeighborhood &&
    `${book.userStreet}, ${book.userNumber} — ${book.userNeighborhood} · ${book.userCity} — ${book.userState}`

  const mapsUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : null

  return (
    <Card className="hover:shadow-xl shadow-sm border border-border/50 h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Book className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight mb-1 truncate" title={book.title}>
              {book.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground truncate" title={book.author}>
              {book.author}
            </p>
            <p className="text-sm text-muted-foreground truncate" title={book.genre}>
              {book.genre}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-grow">
        {/* Objectives */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Disponível para:</p>
          <div className="flex flex-wrap gap-2">
            {book.objectives.map((objective) => (
              <Badge key={objective} variant="secondary" className={objectiveColors[objective]}>
                {objectiveLabels[objective]}
              </Badge>
            ))}
          </div>
        </div>

        {/* Owner Info */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-3">
            Informações do proprietário:
          </p>

          <div className="space-y-2">
            {/* Nome */}
            <div className="flex items-center gap-2 text-sm truncate" title={book.userName}>
              <span className="font-medium">{book.userName}</span>
            </div>

            {/* Endereço agrupado */}
            {(book.userCity || mapsUrl) && (
              <div className="flex items-center gap-2 text-sm truncate">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                {mapsUrl ? (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate hover:text-primary transition-colors flex items-center gap-1"
                    title="Ver no Maps"
                  >
                    <span className="truncate">{fullAddress}</span>
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                ) : (
                  <span className="truncate">
                    {book.userCity} — {book.userState}
                  </span>
                )}
              </div>
            )}

            {/* Contatos */}
            {book.userPhone && book.userPublicContact && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a
                    title={book.userPhone}
                    href={`tel:${book.userPhone}`}
                    className="truncate text-muted-foreground hover:text-primary transition-colors"
                  >
                    {book.userPhone}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    title={book.userEmail}
                    href={`mailto:${book.userEmail}`}
                    className="truncate text-muted-foreground hover:text-primary transition-colors"
                  >
                    {book.userEmail}
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}