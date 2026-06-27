"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"

const API = process.env.NEXT_PUBLIC_API_URL

interface Metadata {
  titles: { text: string; style: string }[]
  description: { full: string; short: string }
  tags: string[]
  chapters: { timestamp: string; title: string }[]
  summary: string
  primary_keyword: string
}

interface Job {
  id: string
  status: string
  progress: number
  transcript: string | null
  metadata: Metadata | null
  platform: string
  filename: string
}

export default function ResultadoPage() {
  const { id } = useParams()
  const [job, setJob] = useState<Job | null>(null)
  const [copied, setCopied] = useState("")

  useEffect(() => {
    const interval = setInterval(async () => {
      const { data } = await axios.get(`${API}/videos/${id}`)
      setJob(data.job)
      if (data.job.status === "done" || data.job.status === "error") {
        clearInterval(interval)
      }
    }, 3000)

    // Chama imediatamente
    axios.get(`${API}/videos/${id}`).then(({ data }) => setJob(data.job))

    return () => clearInterval(interval)
  }, [id])

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(""), 2000)
  }

  if (!job) return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-zinc-400">Carregando...</p>
    </main>
  )

  if (job.status === "error") return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-400 text-lg mb-4">Erro ao processar vídeo</p>
        <a href="/upload" className="text-zinc-400 hover:text-white text-sm">← Tentar novamente</a>
      </div>
    </main>
  )

  if (job.status !== "done") return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-2">Processando...</h2>
        <p className="text-zinc-400 text-sm mb-8">{job.filename}</p>

        <div className="w-full bg-white/10 rounded-full h-2 mb-3">
          <div
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${job.progress}%` }}
          />
        </div>
        <p className="text-zinc-500 text-sm">{job.progress}%</p>

        <div className="mt-8 text-zinc-600 text-xs space-y-1">
          <p className={job.progress >= 30 ? "text-zinc-400" : ""}>
            {job.progress >= 30 ? "✓" : "○"} Download do vídeo
          </p>
          <p className={job.progress >= 50 ? "text-zinc-400" : ""}>
            {job.progress >= 50 ? "✓" : "○"} Extração de áudio
          </p>
          <p className={job.progress >= 70 ? "text-zinc-400" : ""}>
            {job.progress >= 70 ? "✓" : "○"} Transcrição
          </p>
          <p className={job.progress >= 100 ? "text-zinc-400" : ""}>
            {job.progress >= 100 ? "✓" : "○"} Geração de metadados
          </p>
        </div>
      </div>
    </main>
  )

  const m = job.metadata!

  return (
    <main className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold">Metadados gerados</h1>
            <p className="text-zinc-500 text-sm mt-1">{job.filename}</p>
          </div>
          <a href="/upload" className="text-sm text-zinc-500 hover:text-white transition">
            + Novo vídeo
          </a>
        </div>

        {/* Títulos */}
        <section className="mb-8">
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-3">
            Títulos sugeridos
          </h2>
          <div className="space-y-2">
            {m.titles.map((t, i) => (
              <div
                key={i}
                onClick={() => copy(t.text, `title-${i}`)}
                className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/10 transition"
              >
                <span className="text-sm">{t.text}</span>
                <span className="text-xs text-zinc-600 ml-4 shrink-0">
                  {copied === `title-${i}` ? "✓ copiado" : t.style}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Descrição */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              Descrição
            </h2>
            <button
              onClick={() => copy(m.description.full, "desc")}
              className="text-xs text-zinc-500 hover:text-white transition"
            >
              {copied === "desc" ? "✓ copiado" : "copiar"}
            </button>
          </div>
          <textarea
            readOnly
            value={m.description.full}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-300 resize-none h-36"
          />
        </section>

        {/* Tags */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              Tags
            </h2>
            <button
              onClick={() => copy(m.tags.join(", "), "tags")}
              className="text-xs text-zinc-500 hover:text-white transition"
            >
              {copied === "tags" ? "✓ copiado" : "copiar tudo"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {m.tags.map((tag, i) => (
              <span
                key={i}
                onClick={() => copy(tag, `tag-${i}`)}
                className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs cursor-pointer hover:bg-white/10 transition"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Capítulos */}
        {m.chapters.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
                Capítulos
              </h2>
              <button
                onClick={() => copy(m.chapters.map(c => `${c.timestamp} ${c.title}`).join("\n"), "chapters")}
                className="text-xs text-zinc-500 hover:text-white transition"
              >
                {copied === "chapters" ? "✓ copiado" : "copiar"}
              </button>
            </div>
            <div className="space-y-2">
              {m.chapters.map((c, i) => (
                <div key={i} className="flex gap-4 text-sm">
                  <span className="text-zinc-500 font-mono shrink-0">{c.timestamp}</span>
                  <span className="text-zinc-300">{c.title}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Transcrição */}
        {job.transcript && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
                Transcrição
              </h2>
              <button
                onClick={() => copy(job.transcript!, "transcript")}
                className="text-xs text-zinc-500 hover:text-white transition"
              >
                {copied === "transcript" ? "✓ copiado" : "copiar"}
              </button>
            </div>
            <textarea
              readOnly
              value={job.transcript}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-400 resize-none h-32"
            />
          </section>
        )}

      </div>
    </main>
  )
}
