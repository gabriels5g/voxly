"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

const API = process.env.NEXT_PUBLIC_API_URL

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [platform, setPlatform] = useState("youtube")
  const [tone, setTone] = useState("casual")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  async function handleSubmit() {
    if (!file) return
    setLoading(true)
    setError("")

    try {
      // 1. Cria o job
      const { data: jobData } = await axios.post(`${API}/videos`, {
        filename: file.name,
        filesize: file.size,
        mimetype: file.type,
        platform,
        tone,
      })

      const jobId = jobData.job.id

      // 2. Faz o upload do arquivo
      const form = new FormData()
      form.append("file", file)
      await axios.post(`${API}/upload/${jobId}`, form)

      // 3. Redireciona para a tela de resultados
      router.push(`/resultado/${jobId}`)

    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao enviar vídeo")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl">

        <a href="/" className="text-zinc-500 text-sm mb-8 block hover:text-white transition">
          ← Voltar
        </a>

        <h1 className="text-3xl font-bold mb-2">Enviar vídeo</h1>
        <p className="text-zinc-400 mb-8 text-sm">
          Suporta MP4, MOV, AVI, MP3, WAV — até 500MB
        </p>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border border-dashed border-white/20 rounded-2xl p-10 text-center cursor-pointer hover:border-white/40 hover:bg-white/5 transition mb-6"
        >
          {file ? (
            <div>
              <p className="text-white font-medium">{file.name}</p>
              <p className="text-zinc-500 text-sm mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-zinc-400 mb-1">Arraste o vídeo aqui</p>
              <p className="text-zinc-600 text-sm">ou clique para selecionar</p>
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="video/*,audio/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
        />

        {/* Opções */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs text-zinc-500 mb-2 block">Plataforma</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-2 block">Tom</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            >
              <option value="casual">Casual</option>
              <option value="professional">Profissional</option>
              <option value="educational">Educacional</option>
              <option value="entertaining">Entretenimento</option>
            </select>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-zinc-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loading ? "Enviando..." : "Gerar metadados"}
        </button>

      </div>
    </main>
  )
}
