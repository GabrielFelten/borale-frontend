"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, User, Library } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  const getNavLinks = () => {
    const allLinks = [
      { href: "/catalog", label: "Catálogo", icon: BookOpen },
      { href: "/perfil", label: "Perfil", icon: User },
      { href: "/books", label: "Meus Livros", icon: Library },
    ]

    // Retorna links exceto a página atual
    return allLinks.filter((link) => link.href !== pathname)
  }

  const navLinks = getNavLinks()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/catalog"
            className="flex items-center gap-2 font-bold text-xl hover:text-primary transition-colors"
          >
            <span className="text-2xl">📚</span>
            <span>BoraLê</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Button key={link.href} asChild variant="ghost" className="gap-2">
                  <Link href={link.href}>
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{link.label}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}