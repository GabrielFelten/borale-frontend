"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BookOpen, Heart, RefreshCw, University, Users } from "lucide-react"
import { useEffect } from "react";

export function HeroSection() {
  useEffect(() => {
      // Hospedagem do backend gratuito desliga por inatividade.
      // Por isso precisa de inicialização na home do site. 
      // Assim as outras requisições ficam um pouco mais rápidas.
      const fetchData = async () => {
        const response = await fetch(
          "https://boralebackend.onrender.com/api/Login/InitApi"
        );
        const data = await response.json();
      };
      fetchData();
    }, []);

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        {/* Logo e Título */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">📚</div>
          <h1 className="text-5xl md:text-6xl font-bold text-balance mb-4">BoraLer</h1>
          <p className="text-xl md:text-2xl text-muted-foreground text-balance">
            Unindo pessoas e bibliotecas por meio do compartilhamento de livros
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
                <University className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-semibold text-xl mb-2">Explore as bibliotecas da sua cidade</h3>
                <p className="text-muted-foreground">
                  Encontre rapidamente livros disponíveis perto de você. Pesquise por título, autor ou gênero, veja a disponibilidade em tempo real e descubra novos acervos locais. Após escolher o que deseja, é só se dirigir até a biblioteca para retirar o livro e aproveitar a leitura.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ação principal - Catálogo */}
        <div className="flex justify-center mb-6">
          <Button asChild size="lg" className="text-lg h-14 px-8">
            <Link href="/catalog" className="flex items-center">
              Ver Catálogo de Livros
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="outline" className="text-lg h-14 px-8 bg-transparent">
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