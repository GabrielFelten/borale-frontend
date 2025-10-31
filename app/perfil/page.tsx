"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, MapPin, Phone, Mail, CheckCircle2 } from "lucide-react"
import { formatPhoneNumber } from "@/lib/phone-mask"

interface Estado {
  id: number
  sigla: string
  nome: string
}

interface Cidade {
  id: number
  nome: string
}

export default function PerfilPage() {
  const router = useRouter()
  const [nome, setNome] = useState("")
  const [estado, setEstado] = useState("")
  const [cidade, setCidade] = useState("")
  const [contato, setContato] = useState("")
  const [email, setEmail] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [estados, setEstados] = useState<Estado[]>([])
  const [cidadesDisponiveis, setCidadesDisponiveis] = useState<Cidade[]>([])
  const [loadingEstados, setLoadingEstados] = useState(false)
  const [loadingCidades, setLoadingCidades] = useState(false)

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
    const fetchEstados = async () => {
      setLoadingEstados(true)
      try {
        const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
        const data: Estado[] = await response.json()
        setEstados(data)
      } catch (error) {
        console.error("Erro ao buscar estados:", error)
      } finally {
        setLoadingEstados(false)
      }
    }

    fetchEstados()
  }, [])

  useEffect(() => {
    const fetchCidades = async () => {
      if (!estado) {
        setCidadesDisponiveis([])
        return
      }

      setLoadingCidades(true)
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios?orderBy=nome`,
        )
        const data: Cidade[] = await response.json()
        setCidadesDisponiveis(data)
      } catch (error) {
        console.error("Erro ao buscar cidades:", error)
      } finally {
        setLoadingCidades(false)
      }
    }

    fetchCidades()
  }, [estado])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingData(true)

        const userId = document.cookie
          .split("; ")
          .find((row) => row.startsWith("userId="))
          ?.split("=")[1] || ""

        const params = new URLSearchParams({ userId });
        const response = await fetch(`https://boralebackend.onrender.com/api/Login/GetUser?${params}`)
        const data = await response.json()
        setNome(data.name)
        setEstado(data.state)
        setCidade(data.city)
        setContato(data.phone)
        setEmail(data.email)

      } catch (error) {
        console.error("Erro ao buscar perfil:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setShowSuccess(false)

    try {
      const userId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userId="))
        ?.split("=")[1]

      const baseUrl = "https://boralebackend.onrender.com";
      const response = await fetch(`${baseUrl}/api/Login/UpsertUser`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json; charset=utf-8",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          Id: userId,
          Name: nome,
          Email: email,
          Pass: "",
          State: estado,
          City: cidade,
          Phone: contato
        }),
      });

      setShowSuccess(true)
    } catch (error) {
      console.error("Erro ao salvar perfil:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContatoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setContato(formatted)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-2xl shadow-2xl border-0">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">Meu Perfil</CardTitle>
                <CardDescription className="text-base">Gerencie suas informações pessoais</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoadingData ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-muted-foreground mt-4">Carregando perfil...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Nome completo
                  </Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="h-11"
                    disabled={isLoading}
                    required
                  />
                </div>

                {/* E-mail */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado" className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Estado
                  </Label>
                  <Select value={estado} onValueChange={setEstado} disabled={isLoading || loadingEstados}>
                    <SelectTrigger id="estado" className="w-full h-11">
                      <SelectValue placeholder={loadingEstados ? "Carregando estados..." : "Selecione seu estado"} />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map((est) => (
                        <SelectItem key={est.id} value={est.sigla}>
                          {est.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cidade" className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Cidade
                  </Label>
                  <Select value={cidade} onValueChange={setCidade} disabled={isLoading || !estado || loadingCidades}>
                    <SelectTrigger id="cidade" className="w-full h-11">
                      <SelectValue
                        placeholder={
                          loadingCidades
                            ? "Carregando cidades..."
                            : estado
                              ? "Selecione sua cidade"
                              : "Selecione o estado primeiro"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cidadesDisponiveis.map((cid) => (
                        <SelectItem key={cid.id} value={cid.nome}>
                          {cid.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contato" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Contato
                  </Label>
                  <Input
                    id="contato"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={contato}
                    onChange={handleContatoChange}
                    className="h-11"
                    disabled={isLoading}
                    required
                  />
                </div>

                {/* Mensagem de sucesso */}
                {showSuccess && (
                  <Alert className="bg-success/10 text-success border-success/20">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>Alterações salvas com sucesso!</AlertDescription>
                  </Alert>
                )}

                {/* Botão de salvar */}
                <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Salvando...
                    </div>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}