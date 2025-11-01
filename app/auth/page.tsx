"use client"

import { AuthForm } from "@/components/auth-form"
import React from "react"

export default function AuthPage() {
  return (
    <React.Suspense fallback={<div>Carregando...</div>}>
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-background p-4">
        <AuthForm />
      </main>
    </React.Suspense>
  )
}