"use client"

import { useAuth, UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { isSignedIn } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) =>
    pathname === path ? "text-white font-medium" : "text-zinc-400 hover:text-white"

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-black sticky top-0 z-50">
      <a href="/" className="text-lg font-bold text-white tracking-tight">
        Voxly
      </a>

      <div className="flex items-center gap-6">
        {isSignedIn ? (
          <>
            <a href="/upload" className={`text-sm transition ${isActive("/upload")}`}>
              Upload
            </a>
            <a href="/historico" className={`text-sm transition ${isActive("/historico")}`}>
              Histórico
            </a>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                }
              }}
            />
          </>
        ) : (
          <>
            <a href="#" className="text-sm text-zinc-400 hover:text-white transition">
              Preços
            </a>
            <a href="/sign-in" className="text-sm bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-zinc-200 transition">
              Entrar
            </a>
          </>
        )}
      </div>
    </nav>
  )
}
