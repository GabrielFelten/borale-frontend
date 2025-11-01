import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Book, Mail, Phone, MapPin } from "lucide-react"

interface BookCardProps {
  book: {
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
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Book className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight mb-1">{book.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{book.genre}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
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
          <p className="text-xs font-medium text-muted-foreground mb-3">Informações do proprietário:</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-foreground">{book.userCity} - {book.userState}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <a href={`tel:${book.userPhone}`} className="text-foreground hover:text-primary transition-colors">
                {book.userPhone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <a
                href={`mailto:${book.userEmail}`}
                className="text-foreground hover:text-primary transition-colors truncate"
              >
                {book.userEmail}
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}