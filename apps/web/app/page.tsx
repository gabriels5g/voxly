export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <span className="text-xl font-bold tracking-tight">Voxly</span>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm text-zinc-400 hover:text-white transition">Preços</a>
          <a href="/upload" className="text-sm bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-zinc-200 transition">
            Entrar
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-32">
        <div className="inline-block bg-white/10 text-zinc-300 text-xs px-3 py-1 rounded-full mb-6 border border-white/20">
          ✨ Powered by Groq + Whisper
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight max-w-4xl">
          Seu vídeo.<br />
          <span className="text-zinc-400">Metadados perfeitos.</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mb-10">
          Faça upload do vídeo, a IA transcreve e gera títulos, descrição, tags, capítulos e posts para redes sociais em segundos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="/upload" className="bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-zinc-200 transition">
            Começar grátis
          </a>
          <button className="border border-white/20 text-white px-8 py-3 rounded-full hover:bg-white/10 transition">
            Ver demonstração
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-20 max-w-5xl mx-auto">
        <h2 className="text-center text-2xl font-bold mb-12 text-zinc-300">Tudo que você precisa para crescer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { emoji: "🎙️", title: "Transcrição automática", desc: "Whisper AI transcreve qualquer vídeo com timestamps precisos, em português ou inglês." },
            { emoji: "✍️", title: "Títulos que convertem", desc: "4 variações de título com diferentes estilos — curiosidade, lista, direto e emocional." },
            { emoji: "🏷️", title: "Tags & SEO", desc: "Palavras-chave relevantes geradas automaticamente para maximizar o alcance orgânico." },
            { emoji: "📋", title: "Descrição completa", desc: "Com emojis, hashtags, timestamps e CTA — pronta para colar no YouTube." },
            { emoji: "🎬", title: "Capítulos automáticos", desc: "Detecta os tópicos do vídeo e cria os timestamps de capítulo automaticamente." },
            { emoji: "📱", title: "Posts para redes sociais", desc: "Gera posts prontos para Instagram, Twitter, LinkedIn e YouTube Community." },
          ].map((f) => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-6 text-center text-zinc-600 text-sm">
        © 2026 Voxly. Feito com IA.
      </footer>

    </main>
  )
}
