"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"

const API = process.env.NEXT_PUBLIC_API_URL

interface Video {
  id: string
  filename: string
  platform: string
  status: string
  createdAt: string
  metadata: {
    titles: { text: string }[]
  } | null
}

export default function HistoricoPage() {
  const { getToken } = useAuth()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken()
        const { data } = await axios.get(`${API}/videos`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setVideos(data.videos.reverse())
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const statusLabel: Record<string, string> = {
    pending: "Pendente",
    uploaded: "Enviado",
    processing: "Processando",
    done: "Concluído",
    error: "Erro",
  }

  const statusColor: Record<string, string> = {
    pending: "text-zinc-400",
    uploaded: "text-zinc-400",
    processing: "text-yellow-400",
    done: "text-green-400",
    error: "text-red-400",
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold">Histórico</h1>
            <p className="text-zinc-500 text-sm mt-1">Seus vídeos processados</p>
          </div>
          <a href="/upload" className="text-sm bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-zinc-200 transition">
            + Novo vídeo
          </a>
        </div>

        {loading && (
          <p className="text-zinc-500 text-sm">Carregando...</p>
        )}

        {!loading && videos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 mb-4">Nenhum vídeo processado ainda.</p>
            <a href="/upload" className="text-white underline text-sm">Enviar primeiro vídeo</a>
          </div>
        )}

        <div className="space-y-3">
          {videos.map((v) => (

              <a key={v.id}
              href={v.status === "done" ? `/resultado/${v.id}` : "#"}
              className="block bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:bg-white/10 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {v.metadata?.titles?.[0]?.text || v.filename}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {v.platform} · {formatDate(v.createdAt)}
                  </p>
                </div>
                <span className={`text-xs font-medium ml-4 shrink-0 ${statusColor[v.status]}`}>
                  {statusLabel[v.status]}
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </main>
  )
}
