const express = require("express");
const app = express();
app.use(express.json());

// Libera CORS para qualquer página HTML
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

let sensorData = {
  temperatura: 0,
  umidade: 0,
  luz: 0,
  bemEstar: "Carregando..."
};

// ESP32 envia aqui
app.post("/update", (req, res) => {
  const { temperatura, umidade, luz } = req.body;

  sensorData.temperatura = temperatura;
  sensorData.umidade = umidade;
  sensorData.luz = luz;

  // lógica simples de bem estar
  if (temperatura > 30 || umidade < 30 || luz < 300) {
    sensorData.bemEstar = "⚠ Ambiente desconfortável — sugere pausa!";
  } else {
    sensorData.bemEstar = "✔ Ambiente saudável";
  }

  console.log("📥 Dados recebidos do ESP32:", sensorData);
  res.json({ status: "OK" });
});

// HTML lê aqui
app.get("/status", (req, res) => {
  res.json(sensorData);
});

// Servidor
app.listen(80, () => console.log("🚀 Servidor rodando na porta 80"));
