import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Route for sending emails
  app.post("/api/sendReport", async (req: any, res: any) => {
    const { email, data, smtpSettings, attachment, bcc, subject } = req.body;

    if (!smtpSettings || !smtpSettings.host) {
      return res.status(400).json({ status: "error", message: "SMTP ayarları eksik." });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: smtpSettings.host,
        port: parseInt(smtpSettings.port),
        secure: smtpSettings.port === "465",
        auth: {
          user: smtpSettings.user,
          pass: smtpSettings.pass,
        },
      });

      const mailOptions: any = {
        from: smtpSettings.fromEmail || smtpSettings.user,
        to: smtpSettings.toEmail || email,
        subject: subject || "Film Arşivi Raporu",
        text: "Film arşivi verileriniz ekte yer almaktadır.",
        bcc: bcc || undefined,
      };

      if (attachment) {
        mailOptions.attachments = [
          {
            filename: attachment.filename,
            content: attachment.content,
            encoding: 'base64'
          }
        ];
      }

      await transporter.sendMail(mailOptions);
      res.json({ status: "success", message: "E-posta başarıyla gönderildi." });
    } catch (error: any) {
      console.error("Email sending error:", error);
      res.status(500).json({ status: "error", message: error.message });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
