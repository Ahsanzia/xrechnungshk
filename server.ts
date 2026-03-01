import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";

const app = express();
const PORT = 3000;
const db = new Database("conversions.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS usage (
    ip TEXT PRIMARY KEY,
    last_conversion_date TEXT,
    count INTEGER DEFAULT 0
  )
`);

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  // API routes
  app.use(express.json());

  app.post("/api/convert", upload.single("pdf"), async (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const today = new Date().toISOString().split("T")[0];

    // Check IP limit
    const row = db.prepare("SELECT * FROM usage WHERE ip = ?").get(ip) as { last_conversion_date: string, count: number } | undefined;

    if (row && row.last_conversion_date === today && row.count >= 1) {
      return res.status(429).json({ error: "Tageslimit erreicht. Bitte versuchen Sie es morgen wieder oder nutzen Sie handy-bill.de für unbegrenzte Rechnungen." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Keine Datei hochgeladen." });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: "application/pdf",
                  data: req.file.buffer.toString("base64"),
                },
              },
              {
                text: `Extract all invoice details from this PDF and return them as a JSON object. 
                Include: invoiceNumber, date, sellerName, sellerAddress, sellerVatId, buyerName, buyerAddress, buyerVatId, 
                items (description, quantity, unitPrice, vatRate, totalAmount), currency, totalNetAmount, totalVatAmount, totalGrossAmount.
                The output MUST be valid JSON.`,
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
        }
      });

      const response = await model;
      const invoiceData = JSON.parse(response.text || "{}");

      // Update usage
      if (row) {
        db.prepare("UPDATE usage SET last_conversion_date = ?, count = count + 1 WHERE ip = ?").run(today, ip);
      } else {
        db.prepare("INSERT INTO usage (ip, last_conversion_date, count) VALUES (?, ?, 1)").run(ip, today);
      }

      res.json({ 
        success: true, 
        data: invoiceData,
        message: "Konvertierung erfolgreich. Bitte prüfen Sie die Daten."
      });
    } catch (error) {
      console.error("Conversion error:", error);
      res.status(500).json({ error: "Fehler bei der Verarbeitung der PDF. Bitte stellen Sie sicher, dass es sich um eine gültige Rechnung handelt." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
