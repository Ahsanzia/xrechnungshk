import React, { useState, useEffect } from 'react';
import { Upload, FileText, Download, CheckCircle, AlertCircle, ExternalLink, Info, BookOpen, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateXRechnung, InvoiceData } from './lib/xrechnung';
import { BLOG_POSTS } from './constants';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InvoiceData | null>(null);
  const [view, setView] = useState<'home' | 'blog' | 'impressum' | 'datenschutz'>('home');
  const [selectedPost, setSelectedPost] = useState<typeof BLOG_POSTS[0] | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Konvertierung fehlgeschlagen');
      }

      setResult(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadXML = () => {
    if (!result) return;
    const xml = generateXRechnung(result);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `XRechnung_${result.invoiceNumber || 'Rechnung'}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderHome = () => (
    <div className="space-y-12">
      <section className="text-center space-y-6 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900"
        >
          PDF zu <span className="text-blue-600">XRechnung</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-600 max-w-2xl mx-auto"
        >
          Kostenloser, KI-gestützter Konverter für deutsche E-Rechnungen. 
          GoBD-konform und sicher.
        </motion.p>
      </section>

      <section className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">
          <div className="space-y-8">
            {!result ? (
              <div className="space-y-6">
                <div 
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
                    file ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                      <Upload size={32} />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-slate-900">
                        {file ? file.name : 'PDF-Rechnung hier ablegen'}
                      </p>
                      <p className="text-sm text-slate-500">
                        Oder klicken Sie zum Auswählen (Max. 10MB)
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="shrink-0 mt-0.5" size={20} />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                    !file || loading 
                      ? 'bg-slate-300 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verarbeite PDF...
                    </>
                  ) : (
                    <>
                      <FileText size={20} />
                      Jetzt konvertieren
                    </>
                  )}
                </button>
                
                <p className="text-center text-xs text-slate-400">
                  Hinweis: 1 Konvertierung pro IP/Tag. Für unbegrenzte Rechnungen nutzen Sie <a href="https://www.handy-bill.de" className="text-blue-500 hover:underline">Handy-Bill.de</a>.
                </p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-6 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">Konvertierung erfolgreich!</h3>
                    <p className="text-sm opacity-90">Ihre XRechnung steht zum Download bereit.</p>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-2xl p-6 space-y-4 bg-slate-50">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Rechnungsnummer:</span>
                    <span className="font-medium text-slate-900">{result.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Gesamtbetrag:</span>
                    <span className="font-medium text-slate-900">{result.totalGrossAmount} {result.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Verkäufer:</span>
                    <span className="font-medium text-slate-900">{result.sellerName}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-[10px] text-slate-400 leading-tight">
                      <Info size={10} className="inline mr-1" />
                      Hinweis: Die generierte Datei nutzt Ihre USt-IdNr als Platzhalter für die Leitweg-ID. Für Behördenrechnungen muss diese ggf. manuell in der XML angepasst werden.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={downloadXML}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100"
                  >
                    <Download size={20} />
                    XML herunterladen
                  </button>
                  <button
                    onClick={() => {setResult(null); setFile(null);}}
                    className="w-full py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition-all"
                  >
                    Weitere Datei
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">GoBD Konform</h3>
          <p className="text-slate-600 leading-relaxed">
            Unsere generierten XRechnungen entsprechen den aktuellen Standards der deutschen Finanzverwaltung.
          </p>
        </div>
        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Info size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">KI-Analyse</h3>
          <p className="text-slate-600 leading-relaxed">
            Modernste KI extrahiert präzise alle Rechnungsdaten aus Ihren PDF-Dokumenten ohne manuelles Abtippen.
          </p>
        </div>
        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <ExternalLink size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Handy-Bill.de</h3>
          <p className="text-slate-600 leading-relaxed">
            Für professionelle Rechnungsstellung und unbegrenzte XRechnungen empfehlen wir unseren Partner.
          </p>
        </div>
      </section>

      <section className="bg-slate-900 text-white rounded-[3rem] p-12 md:p-20 text-center space-y-8">
        <h2 className="text-4xl font-bold">Professionelle E-Rechnungen nötig?</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Verwalten Sie Ihre gesamte Buchhaltung an einem Ort. GoBD-konform, einfach und effizient.
        </p>
        <a 
          href="https://www.handy-bill.de" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all transform hover:scale-105"
        >
          Zu Handy-Bill.de wechseln
          <ChevronRight size={20} />
        </a>
      </section>
    </div>
  );

  const renderBlog = () => (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      {!selectedPost ? (
        <>
          <h1 className="text-4xl font-bold text-slate-900">Ratgeber & News zur XRechnung</h1>
          <div className="grid gap-8">
            {BLOG_POSTS.map(post => (
              <div 
                key={post.id} 
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                onClick={() => setSelectedPost(post)}
              >
                <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-4">{post.title}</h2>
                <p className="text-slate-600 mb-6">{post.excerpt}</p>
                <span className="text-blue-600 font-semibold flex items-center gap-1">
                  Weiterlesen <ChevronRight size={16} />
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <article className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-8">
          <button 
            onClick={() => setSelectedPost(null)}
            className="text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            ← Zurück zur Übersicht
          </button>
          <h1 className="text-4xl font-bold text-slate-900">{selectedPost.title}</h1>
          <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-blue-600">
            <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
          </div>
        </article>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => {setView('home'); setSelectedPost(null);}}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <FileText size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">X-Converter</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => {setView('home'); setSelectedPost(null);}}
              className={`font-medium transition-colors ${view === 'home' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Konverter
            </button>
            <button 
              onClick={() => {setView('blog'); setSelectedPost(null);}}
              className={`font-medium transition-colors ${view === 'blog' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Blog
            </button>
            <a 
              href="https://www.handy-bill.de" 
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-all"
            >
              Handy-Bill.de
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={view + (selectedPost?.id || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {view === 'home' && renderHome()}
            {view === 'blog' && renderBlog()}
            {view === 'impressum' && (
              <div className="max-w-3xl mx-auto bg-white p-12 rounded-3xl border border-slate-100 shadow-sm prose prose-slate">
                <h1>Impressum</h1>
                <p>Angaben gemäß § 5 TMG</p>
                <p>Musterfirma GmbH<br />Musterstraße 1<br />12345 Musterstadt</p>
                <p>Vertreten durch:<br />Max Mustermann</p>
                <p>Kontakt:<br />Telefon: +49 (0) 123 445566<br />E-Mail: info@x-converter.de</p>
              </div>
            )}
            {view === 'datenschutz' && (
              <div className="max-w-3xl mx-auto bg-white p-12 rounded-3xl border border-slate-100 shadow-sm prose prose-slate">
                <h1>Datenschutzerklärung</h1>
                <p>Wir nehmen den Schutz Ihrer Daten sehr ernst. Hier erfahren Sie, wie wir mit Ihren Daten umgehen.</p>
                <h3>1. Datenerfassung</h3>
                <p>Wir speichern Ihre IP-Adresse temporär, um das Nutzungslimit von einer Konvertierung pro Tag durchzusetzen. Diese Daten werden nach 24 Stunden anonymisiert.</p>
                <h3>2. PDF-Verarbeitung</h3>
                <p>Hochgeladene PDF-Dateien werden ausschließlich zur Konvertierung verarbeitet und nicht dauerhaft gespeichert. Nach der Verarbeitung werden die Dateien sofort gelöscht.</p>
                <h3>3. Drittanbieter</h3>
                <p>Wir nutzen die Google Gemini API zur Analyse der Rechnungsdaten. Dabei werden die Inhalte der PDF an Google übermittelt.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-slate-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <FileText size={18} />
              </div>
              <span className="text-lg font-bold">X-Converter</span>
            </div>
            <p className="text-slate-500 max-w-sm">
              Ihr zuverlässiger Partner für die Konvertierung von PDF-Rechnungen in das XRechnung-Format. Schnell, sicher und GoBD-konform.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900">Rechtliches</h4>
            <ul className="space-y-2 text-slate-600">
              <li><button onClick={() => setView('impressum')} className="hover:text-blue-600">Impressum</button></li>
              <li><button onClick={() => setView('datenschutz')} className="hover:text-blue-600">Datenschutz</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900">Links</h4>
            <ul className="space-y-2 text-slate-600">
              <li><button onClick={() => setView('blog')} className="hover:text-blue-600">Ratgeber</button></li>
              <li><a href="https://www.handy-bill.de" className="hover:text-blue-600">Handy-Bill.de</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-50 text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} X-Converter. Alle Rechte vorbehalten.
        </div>
      </footer>
    </div>
  );
}
