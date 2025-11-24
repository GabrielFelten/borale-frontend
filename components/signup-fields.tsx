"use client"

import { User, Phone, Loader2, Mail, LockIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { formatPhoneNumber } from "@/lib/phone-mask"
import { buscarViaCep } from "@/services/locationService";
import { useState } from "react"

interface Props {
  mode?: "signup" | "update"
  name: string
  email?: string
  password?: string
  cep: string
  rua: string
  numero: string
  bairro: string
  cttPublico: boolean
  tipo: string
  contato: string
  isLoading: boolean
  setName: (v: string) => void
  setEmail?: (v: string) => void
  setPassword?: (v: string) => void
  setEstado: (v: string) => void
  setCidade: (v: string) => void
  setContato: (v: string) => void
  setCep: (v: string) => void
  setRua: (v: string) => void
  setNumero: (v: string) => void
  setBairro: (v: string) => void
  setCttPublico: (v: boolean) => void
  setTipo: (v: string) => void
}

export default function SignupFields(props: Props) {
  const {
    mode = "update",
    email, password, name, cep, rua, numero, bairro, cttPublico, tipo, contato,
    isLoading,
    setName, setEmail, setPassword, setEstado, setCidade, setContato, setCttPublico, setCep, setRua, setNumero, setBairro, setTipo
  } = props
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const [erroCep, setErroCep] = useState("")

  const handleContatoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setContato(formatted)
  }

  const handleCepChange = async (value: string) => {
    const cepLimpo = value.replace(/\D/g, "").slice(0, 8)

    const cepFormatado =
      cepLimpo.length > 5
        ? `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}`
        : cepLimpo

    setCep(cepFormatado)
    setErroCep("")
    if (cepLimpo.length !== 8) {
      limparEndereco()
      return
    }

    setIsLoadingCep(true)

    try {
      const data = await buscarViaCep(cepLimpo)

      if (!data) {
        throw new Error("CEP inválido")
      }

      setRua(data.logradouro || "")
      setBairro(data.bairro || "")
      setCidade(data.localidade || "")
      setEstado(data.uf || "")

    } catch (err) {
      limparEndereco()
      setErroCep("CEP não encontrado")
    } finally {
      setIsLoadingCep(false)
    }
  }

  const limparEndereco = () => {
    setRua("")
    setBairro("")
    setCidade("")
    setEstado("")
  }

  return (
    <>
      {mode === "signup" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail?.(e.target.value)}
                className="pl-10 h-11"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword?.(e.target.value)}
                className="pl-10 h-11"
                disabled={isLoading}
              />
            </div>
          </div>
        </>
      )}
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
      <div className="space-y-2">
        <Label htmlFor="contato" className="text-sm font-medium">
          Contato
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="contato"
            type="tel"
            inputMode="numeric"
            placeholder="(00) 00000-0000"
            value={contato}
            onChange={handleContatoChange}
            className="pl-10 h-11"
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="tipoPessoa"
            value="PF"
            checked={tipo === "PF"}
            onChange={(e) => setTipo(e.target.value)}
          />
          Pessoa Física
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="tipoPessoa"
            value="PJ"
            checked={tipo === "PJ"}
            onChange={(e) => setTipo(e.target.value)}
          />
          Pessoa Jurídica
        </label>
      </div>

      {tipo === "PJ" && (
        <div className="space-y-4 mt-4">

          <div className="space-y-1">
            <Label htmlFor="cep">CEP</Label>
            <div className="relative">
              <Input
                id="cep"
                type="text"
                inputMode="numeric"
                placeholder="00000-000"
                value={cep}
                maxLength={9}
                onChange={(e) => handleCepChange(e.target.value)}
                className={`pl-3 h-11 pr-10 ${erroCep && "border-red-500 focus-visible:ring-red-500"}`}
              />

              {isLoadingCep && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin w-5 h-5" />
              )}
            </div>

            {erroCep && <p className="text-red-500 text-xs">{erroCep}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="rua">Rua</Label>
              <Input
                id="rua"
                type="text"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                placeholder="Rua"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value.replace(/\D/g, ""))}
                placeholder="Número"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bairro">Bairro</Label>
            <Input
              id="bairro"
              type="text"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              placeholder="Bairro"
              disabled={isLoading}
            />
          </div>
        </div>
      )}

      <div className="flex items-start space-x-3 rounded-lg border p-4 bg-muted/30">
        <Checkbox
          id="cttPublico"
          checked={cttPublico}
          onCheckedChange={(checked) => setCttPublico(checked as boolean)}
          disabled={isLoading}
          className="mt-0.5"
        />
        <div className="space-y-1 leading-none">
          <Label htmlFor="cttPublico" className="text-sm font-medium leading-relaxed cursor-pointer">
            Concordo em compartilhar meus dados de contato
          </Label>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Seu e-mail e telefone serão exibidos no catálogo para que outros usuários possam entrar em contato
            sobre trocas, doações e empréstimos de livros.
          </p>
        </div>
      </div>
    </>
  )
}