"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Lock, User, CheckCircle2, AlertCircle, Phone } from "lucide-react"
import { formatPhoneNumber } from "@/lib/phone-mask"

type AuthMode = "login" | "signup"
type FeedbackType = "success" | "error" | null

interface Estado {
  id: number
  sigla: string
  nome: string
}

interface Cidade {
  id: number
  nome: string
}

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [mode, setMode] = useState<AuthMode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [estado, setEstado] = useState("")
  const [cidade, setCidade] = useState("")
  const [contato, setContato] = useState("")
  const [estados, setEstados] = useState<Estado[]>([])
  const [cidadesDisponiveis, setCidadesDisponiveis] = useState<Cidade[]>([])
  const [loadingEstados, setLoadingEstados] = useState(false)
  const [loadingCidades, setLoadingCidades] = useState(false)
  const [agreeToShare, setAgreeToShare] = useState(false)
  const [feedback, setFeedback] = useState<{ type: FeedbackType; message: string }>({
    type: null,
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const modeParam = searchParams.get("mode") as AuthMode
    if (modeParam && (modeParam === "login" || modeParam === "signup")) {
      setMode(modeParam)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchEstados = async () => {
      setLoadingEstados(true)
      try {
        const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
        const data: Estado[] = await response.json()
        setEstados(data)
      } catch (error) {
        console.error("Erro ao buscar estados:", error)
        setFeedback({
          type: "error",
          message: "Erro ao carregar estados. Tente novamente.",
        })
      } finally {
        setLoadingEstados(false)
      }
    }

    if (mode === "signup") {
      fetchEstados()
    }
  }, [mode])

  useEffect(() => {
    const fetchCidades = async () => {
      if (!estado) {
        setCidadesDisponiveis([])
        setCidade("")
        return
      }

      setLoadingCidades(true)
      try {
        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios?orderBy=nome`,
        )
        const data: Cidade[] = await response.json()
        setCidadesDisponiveis(data)
        setCidade("") // Limpar cidade selecionada ao mudar o estado
      } catch (error) {
        console.error("Erro ao buscar cidades:", error)
        setFeedback({
          type: "error",
          message: "Erro ao carregar cidades. Tente novamente.",
        })
      } finally {
        setLoadingCidades(false)
      }
    }

    fetchCidades()
  }, [estado])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setFeedback({ type: null, message: "" })

    if (!email || !password || (mode === "signup" && (!name || !estado || !cidade))) {
      setFeedback({
        type: "error",
        message: "Por favor, preencha todos os campos",
      })
      setIsLoading(false)
      return
    }

    if (mode === "signup" && !agreeToShare) {
      setFeedback({
        type: "error",
        message: "Você precisa concordar em compartilhar seus dados de contato para prosseguir",
      })
      setIsLoading(false)
      return
    }

    if (!email.includes("@")) {
      setFeedback({
        type: "error",
        message: "Por favor, insira um e-mail válido",
      })
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setFeedback({
        type: "error",
        message: "A senha deve ter pelo menos 6 caracteres",
      })
      setIsLoading(false)
      return
    }

    try {
      const baseUrl = "https://boralebackend.onrender.com";
      let response;
      if (mode === "login") {
        const params = new URLSearchParams({ email, pass: password });
        response = await fetch(`${baseUrl}/api/Login/Login?${params.toString()}`, {
          method: "GET",
        });
      } else {
        response = await fetch(`${baseUrl}/api/Login/UpsertUser`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json; charset=utf-8",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            Id: "",
            Name: name,
            Email: email,
            Pass: password,
            State: estado,
            City: cidade,
            Phone: contato
          }),
        });
      }

      const data = await response.json();
      if (!response.ok) {
          setFeedback({
          type: "error",
          message: data.message || "Erro na requisição",
        });
        return;
      }

      document.cookie = `userId=${data.id}; path=/; max-age=2592000`; // 30 dias

      setFeedback({
        type: "success",
        message: "Usuário registrado com sucesso!",
      });

      setTimeout(() => {
        router.push("/catalog");
      }, 1000);
    } catch (error) {
      setFeedback({
        type: "error",
        message: "Ocorreu um erro. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const toggleMode = () => {
    const newMode = mode === "login" ? "signup" : "login"
    setMode(newMode)
    setFeedback({ type: null, message: "" })
    setAgreeToShare(false)
    setEstado("")
    setCidade("")
    setContato("")
    router.push(`/auth?mode=${newMode}`)
  }

  const handleContatoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setContato(formatted)
  }

  return (
    <Card className="w-full max-w-md shadow-2xl border-0">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="flex justify-center">
          <div className="text-5xl mb-2">📚</div>
        </div>
        <CardTitle className="text-3xl font-bold text-balance">BoraLê</CardTitle>
        <CardDescription className="text-base">
          {mode === "login" ? "Entre na sua conta" : "Crie sua conta gratuitamente"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              E-mail
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-11"
                disabled={isLoading}
              />
            </div>
          </div>

          {mode === "signup" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="estado" className="text-sm font-medium">
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
                <Label htmlFor="cidade" className="text-sm font-medium">
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
                <Label htmlFor="contato" className="text-sm font-medium">
                  Contato
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contato"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={contato}
                    onChange={handleContatoChange}
                    className="pl-10 h-11"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </>
          )}

          {mode === "signup" && (
            <div className="flex items-start space-x-3 rounded-lg border p-4 bg-muted/30">
              <Checkbox
                id="agreeToShare"
                checked={agreeToShare}
                onCheckedChange={(checked) => setAgreeToShare(checked as boolean)}
                disabled={isLoading}
                className="mt-0.5"
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="agreeToShare" className="text-sm font-medium leading-relaxed cursor-pointer">
                  Concordo em compartilhar meus dados de contato
                </Label>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Seu e-mail e telefone serão exibidos no catálogo para que outros usuários possam entrar em contato
                  sobre trocas, doações e empréstimos de livros.
                </p>
              </div>
            </div>
          )}

          {feedback.type && (
            <Alert
              variant={feedback.type === "error" ? "destructive" : "default"}
              className={feedback.type === "success" ? "bg-success/10 text-success border-success/20" : ""}
            >
              {feedback.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Processando...
              </div>
            ) : mode === "login" ? (
              "Entrar"
            ) : (
              "Criar conta"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">ou</span>
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            disabled={isLoading}
          >
            {mode === "login" ? (
              <>
                Não tem uma conta? <span className="font-semibold text-primary">Criar conta</span>
              </>
            ) : (
              <>
                Já tem uma conta? <span className="font-semibold text-primary">Entrar</span>
              </>
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}