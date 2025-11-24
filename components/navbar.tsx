"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, User, Library } from "lucide-react"
import { LoginRequiredModal } from "@/components/LoginRequiredModal"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [redirectPath, setRedirectPath] = useState<string | null>(null)

  const isLogged = () => {
    const userId = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userId="))
      ?.split("=")[1]
    return Boolean(userId)
  }

  const getNavLinks = () => {
    const allLinks = [
      { href: "/catalog", label: "Catálogo", icon: BookOpen, protected: false },
      { href: "/perfil", label: "Perfil", icon: User, protected: true },
      { href: "/books", label: "Meus Livros", icon: Library, protected: true },
    ]

    return allLinks.filter((link) => link.href !== pathname)
  }

  const handleProtectedClick = (href: string, requiresLogin: boolean) => {
    if (requiresLogin && !isLogged()) {
      setRedirectPath(href)
      setShowModal(true)
      return
    }
    router.push(href)
  }

  const navLinks = getNavLinks()

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl hover:text-primary transition-colors"
            >
              <span className="text-2xl">📚</span>
              <span>BoraLer</span>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Button
                    key={link.href}
                    variant="ghost"
                    className="gap-2 cursor-pointer"
                    onClick={() => handleProtectedClick(link.href, link.protected)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{link.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      <LoginRequiredModal open={showModal} onOpenChange={setShowModal} redirectPath={redirectPath ?? "/catalog"} />
    </>
  )
}