"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"
import LoginFields from "./login-fields"
import SignupFields from "./signup-fields"

type AuthMode = "login" | "signup"
type FeedbackType = "success" | "error" | null

interface AuthFormProps {
  onSuccess?: () => void,
  inModal?: boolean
}

export function AuthForm({ onSuccess, inModal }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [mode, setMode] = useState<AuthMode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [cep, setCep] = useState("")
  const [rua, setRua] = useState("")
  const [numero, setNumero] = useState("")
  const [bairro, setBairro] = useState("")
  const [cttPublico, setCttPublico] = useState(false)
  const [tipo, setTipo] = useState("")
  const [estado, setEstado] = useState("")
  const [cidade, setCidade] = useState("")
  const [contato, setContato] = useState("")
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

    if (mode === "signup" && !cttPublico) {
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
        message: mode === "login" ? "Login realizado com sucesso!" : "Usuário registrado com sucesso!",
      });

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
          return;
        }
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
    setCttPublico(false)
    setEstado("")
    setCidade("")
    setContato("")
    if (!inModal)
      router.push(`/auth?mode=${newMode}`)
  }

  return (
    <Card className={`w-full max-w-md border-0 ${inModal ? "max-h-[90vh] overflow-hidden" : ""}`}>
      {!inModal && (
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="flex justify-center">
            <div className="text-5xl mb-2">📚</div>
          </div>
          <CardTitle className="text-3xl font-bold text-balance">BoraLer</CardTitle>
          <CardDescription className="text-base">
            {mode === "login"
              ? "Entre na sua conta"
              : "Crie sua conta gratuitamente"}
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={`space-y-6 ${inModal ? "overflow-y-auto pr-1 max-h-[70vh]" : ""}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "login" ? (
            <LoginFields
              email={email}
              password={password}
              isLoading={isLoading}
              setEmail={setEmail}
              setPassword={setPassword}
            />
          ) : (
            <SignupFields
              name={name}
              cep={cep}
              rua={rua}
              numero={numero}
              bairro={bairro}
              cttPublico={cttPublico}
              tipo={tipo}
              estado={estado}
              cidade={cidade}
              contato={contato}
              isLoading={isLoading}
              setName={setName}
              setEstado={setEstado}
              setCidade={setCidade}
              setContato={setContato}
              setCep={setCep}
              setRua={setRua}
              setNumero={setNumero}
              setBairro={setBairro}
              setCttPublico={setCttPublico}
              setTipo={setTipo}
            />
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