import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Razorpay from "razorpay";
import crypto from "crypto";
import admin from "firebase-admin";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8"));

// Initialize Firebase Admin (lazy loading recommended but for simplicity here...)
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
    } catch (error) {
        console.warn("Firebase Admin failed to initialize with default credentials. Ensure environment is set up.");
    }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Order creation for Razorpay
  app.post("/api/payment/create-order", async (req, res) => {
    try {
      const { amount, planId, userId, credits } = req.body;
      
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || 'fake_id',
        key_secret: process.env.RAZORPAY_KEY_SECRET || 'fake_secret'
      });

      const options = {
        amount: amount * 100, // amount in paisa
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: { 
          planId,
          userId,
          credits: credits.toString()
        }
      };

      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error) {
      console.error("Razorpay Order Error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Webhook for Razorpay
  app.post("/api/payment/webhook", async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "webhook_secret";
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest === req.headers["x-razorpay-signature"]) {
      console.log("Request is legit");
      const event = req.body;
      
      if (event.event === "payment.captured") {
        const payload = event.payload.payment.entity;
        const userId = payload.notes.userId;
        const creditsToAdd = parseInt(payload.notes.credits);

        if (userId && creditsToAdd) {
            try {
                const db = admin.firestore();
                const userRef = db.collection("users").doc(userId);
                await userRef.update({
                    credits: admin.firestore.FieldValue.increment(creditsToAdd)
                });
                console.log(`Added ${creditsToAdd} credits to user ${userId}`);
            } catch (err) {
                console.error("Failed to update credits via webhook:", err);
            }
        }
      }
      res.json({ status: "ok" });
    } else {
      res.status(403).json({ error: "Invalid signature" });
    }
  });

  // --- VITE MIDDLEWARE ---
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
