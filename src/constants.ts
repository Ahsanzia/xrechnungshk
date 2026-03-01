import { generateXRechnung, InvoiceData } from './lib/xrechnung';

export const BLOG_POSTS = [
  {
    id: 'was-ist-xrechnung',
    title: 'Was ist eine XRechnung? Alles, was Sie wissen müssen',
    excerpt: 'Die XRechnung ist der Standard für elektronische Rechnungen an öffentliche Auftraggeber in Deutschland. Erfahren Sie hier die Details.',
    content: `
      Die XRechnung ist ein XML-basiertes Datenmodell, das speziell für den Austausch elektronischer Rechnungen mit der öffentlichen Verwaltung in Deutschland entwickelt wurde. 
      Seit dem 27. November 2020 sind Lieferanten des Bundes verpflichtet, Rechnungen ab einem Betrag von 1.000 Euro ausschließlich elektronisch im Format XRechnung einzureichen.

      ### Warum XRechnung?
      Der Hauptvorteil liegt in der automatisierten Verarbeitung. Da es sich um ein rein maschinenlesbares Format handelt, entfällt die manuelle Datenerfassung, was Fehler reduziert und die Zahlung beschleunigt.

      ### GoBD Konformität
      Eine XRechnung muss den Grundsätzen zur ordnungsmäßigen Führung und Aufbewahrung von Büchern, Aufzeichnungen und Unterlagen in elektronischer Form sowie zum Datenzugriff (GoBD) entsprechen.

      Für eine professionelle Verwaltung Ihrer Rechnungen empfehlen wir [Handy-Bill.de](https://www.handy-bill.de).
    `
  },
  {
    id: 'pdf-zu-xrechnung-konvertieren',
    title: 'Wie man PDF in XRechnung konvertiert',
    excerpt: 'Haben Sie nur eine PDF-Rechnung? Kein Problem. Unser Tool hilft Ihnen bei der Konvertierung in das erforderliche XML-Format.',
    content: `
      Viele Unternehmen erstellen ihre Rechnungen noch als PDF. Öffentliche Auftraggeber fordern jedoch oft eine XRechnung. 
      Unser Konverter nutzt künstliche Intelligenz, um die Daten aus Ihrer PDF zu extrahieren und in eine valide XRechnung zu überführen.

      ### Schritte zur Konvertierung:
      1. Laden Sie Ihre PDF-Rechnung hoch.
      2. Unsere KI analysiert die Inhalte (Verkäufer, Käufer, Positionen).
      3. Laden Sie die generierte XML-Datei herunter.

      Hinweis: Unser kostenloser Service ist auf eine Konvertierung pro Tag und IP beschränkt. Für unbegrenzte Rechnungen und professionelle Features besuchen Sie [Handy-Bill.de](https://www.handy-bill.de).
    `
  },
  {
    id: 'e-rechnungspflicht-2025',
    title: 'E-Rechnungspflicht 2025: Was sich für Unternehmen ändert',
    excerpt: 'Ab 2025 wird die E-Rechnung im B2B-Bereich in Deutschland Pflicht. Bereiten Sie sich jetzt vor.',
    content: `
      Das Wachstumschancengesetz bringt weitreichende Änderungen. Ab dem 1. Januar 2025 müssen Unternehmen im B2B-Bereich in der Lage sein, elektronische Rechnungen zu empfangen. 
      Die XRechnung spielt hierbei eine zentrale Rolle.

      ### Was müssen Sie tun?
      Stellen Sie sicher, dass Ihre Buchhaltungssoftware die gängigen E-Rechnungsformate unterstützt. 
      Ein manueller Konverter wie unserer ist eine gute Übergangslösung für Einzelfälle, aber für den täglichen Betrieb ist eine integrierte Lösung wie [Handy-Bill.de](https://www.handy-bill.de) unerlässlich.
    `
  }
];
