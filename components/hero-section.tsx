import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Heart, RefreshCw, Users } from "lucide-react"

export function HeroSection() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        {/* Logo e Título */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">📚</div>
          <h1 className="text-5xl md:text-6xl font-bold text-balance mb-4">BoraLê</h1>
          <p className="text-xl md:text-2xl text-muted-foreground text-balance">
            Conectando leitores através da partilha de livros
          </p>
        </div>

        {/* Cards de Objetivos */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Doação</h3>
              <p className="text-sm text-muted-foreground">
                Doe livros que você já leu e ajude outros a descobrir novas histórias
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Troca</h3>
              <p className="text-sm text-muted-foreground">
                Troque livros com outros leitores e renove sua biblioteca sem gastar
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Empréstimo</h3>
              <p className="text-sm text-muted-foreground">
                Empreste seus livros e tenha acesso a uma biblioteca comunitária
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Comunidade */}
        <Card className="mb-12 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-semibold text-xl mb-2">Faça parte da comunidade</h3>
                <p className="text-muted-foreground">
                  Junte-se a leitores que compartilham o amor pela leitura. Cadastre seus livros, encontre
                  novos títulos e conecte-se com pessoas da sua cidade.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg h-14 px-8">
            <Link href="/auth?mode=login">Fazer Login</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg h-14 px-8 bg-transparent">
            <Link href="/auth?mode=signup">Criar Conta</Link>
          </Button>
        </div>

        {/* Texto adicional */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Gratuito para sempre. Sem taxas, sem complicações.
        </p>
      </div>
    </div>
  )
}