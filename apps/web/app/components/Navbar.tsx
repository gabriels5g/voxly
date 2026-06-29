"use client"

import { useAuth, UserButton } from "@clerk/nextjs"

export default function Navbar() {
  const { isSignedIn } = useAuth()

  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
      <span className="text-xl font-bold tracking-tight">Voxly</span>
      <div className="flex items-center gap-4">
        <a href="#" className="text-sm text-zinc-400 hover:text-white transition">Preços</a>
        {isSignedIn ? (
          <>
            <a href="/upload" className="text-sm text-zinc-400 hover:text-white transition">
              Upload
            </a>
            <UserButton />
          </>
        ) : (
          <a href="/sign-in" className="text-sm bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-zinc-200 transition">
            Entrar
          </a>
        )}
      </div>
    </nav>
  )
}
