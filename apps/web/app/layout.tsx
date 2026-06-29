import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import Navbar from "./components/Navbar"
import "./globals.css"

export const metadata: Metadata = {
  title: "Voxly — Metadados para vídeos com IA",
  description: "Faça upload do seu vídeo e gere títulos, descrição, tags e muito mais com IA.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
