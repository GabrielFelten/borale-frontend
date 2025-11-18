"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginRequiredModal({ open, onOpenChange }: Props) {
  const router = useRouter()

  const goToLogin = () => {
    onOpenChange(false)
    router.push("/auth?mode=login")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Acesso restrito</DialogTitle>
          <DialogDescription>
            Você precisa estar logado para acessar esta área.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={goToLogin}>
            Fazer login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
