const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const API_BASE = "https://api.clashofclans.com/v1";

const VILLAGES = [
  "#LC0JJURV",
  "#8P9CGGC92",
  "#LGQG2Y88Y",
  "#QUJQ08CRG"
];

app.get("/api/villages", async (req, res) => {
  const token = process.env.COC_API_TOKEN;

  if (!token) {
    return res.status(500).json({
      error: "API Token do Clash of Clans não configurada."
    });
  }

  try {
    const results = await Promise.all(
      VILLAGES.map(async (tag) => {
        const url =
          `${API_BASE}/players/${encodeURIComponent(tag)}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        return {
          tag,
          ok: response.ok,
          data
        };
      })
    );

    res.json(results);

  } catch (error) {
    res.status(500).json({
      error: "Erro ao consultar a API do Clash of Clans."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
