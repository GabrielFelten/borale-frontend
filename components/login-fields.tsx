"use client"

import { Mail, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
    email: string
    password: string
    isLoading: boolean
    setEmail: (v: string) => void
    setPassword: (v: string) => void
}

export default function LoginFields({
    email, password, isLoading, setEmail, setPassword
}: Props) {
    return (
        <>
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
        </>
    )
}