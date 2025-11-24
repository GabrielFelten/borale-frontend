"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, CheckCircle2, AlertCircle } from "lucide-react"
import SignupFields from "@/components/signup-fields"
import { login, signup, validateSignup } from "@/services/authService";

type FeedbackType = "success" | "error" | null

export default function PerfilPage() {
  const router = useRouter()
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
  const [email, setEmail] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [feedback, setFeedback] = useState<{ type: FeedbackType; message: string }>({
    type: null,
    message: "",
  })

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
    const fetchProfile = async () => {
      try {
        setIsLoadingData(true)

        const userId = document.cookie
          .split("; ")
          .find((row) => row.startsWith("userId="))
          ?.split("=")[1] || ""

        if (!userId) return;

        const params = new URLSearchParams({ userId });
        const response = await fetch(`https://boralebackend.onrender.com/api/Login/GetUser?${params}`)
        const data = await response.json()
        setName(data.name)
        setEstado(data.state)
        setCidade(data.city)
        setContato(data.phone)
        setEmail(data.email)
        setCep(data.cep)
        setRua(data.street)
        setNumero(data.number)
        setBairro(data.neighborhood)
        setCttPublico(data.publicContact)
        setTipo(data.type)

      } catch (error) {
        console.error("Erro ao buscar perfil:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback({ type: null, message: "" });

    const error = validateSignup({
      name, email, password: "", contato, tipo, cttPublico, cep, rua, numero, bairro
    }, "update");

    if (error) {
      setFeedback({ type: "error", message: error });
      setIsLoading(false);
      return;
    }
    const userId = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userId="))
      ?.split("=")[1]
    try {
      const data = await signup({
        Id: userId,
        Name: name,
        Email: email,
        Pass: "",
        State: estado,
        City: cidade,
        Phone: contato,
        Cep: cep,
        Street: rua,
        Number: numero,
        Neighborhood: bairro,
        PublicContact: cttPublico,
        Type: tipo,
      });

      document.cookie = `userId=${data.id}; path=/; max-age=2592000`;
      setFeedback({
        type: "success",
        message: "Alterações salvas com sucesso!",
      });

    } catch (err: any) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

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
                <SignupFields
                  mode="update"
                  email={email}
                  password={""}
                  name={name}
                  cep={cep}
                  rua={rua}
                  numero={numero}
                  bairro={bairro}
                  cttPublico={cttPublico}
                  tipo={tipo}
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

                {feedback.type && (
                  <Alert
                    variant={feedback.type === "error" ? "destructive" : "default"}
                    className={feedback.type === "success" ? "bg-success/10 text-success border-success/20" : ""}
                  >
                    {feedback.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertDescription>{feedback.message}</AlertDescription>
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