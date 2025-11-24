"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth-form"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void,
  redirectPath: string | null
}

export function LoginRequiredModal({ open, onOpenChange, redirectPath }: Props) {
  const router = useRouter()

  const handleSuccess = () => {
    onOpenChange(false)
    if (redirectPath) {
      router.push(redirectPath)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Faça login para continuar</DialogTitle>
        </DialogHeader>

        <AuthForm inModal onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
