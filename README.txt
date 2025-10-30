# Leaderboard Server (Rompecabezas Paseo Paine)

Servidor mínimo para ranking global.

## Cómo ejecutarlo (local o VPS)

1) Instala Node.js 18+
2) Entra a la carpeta `server/`
3) `npm install`
4) `npm start`  (levanta en http://localhost:3000)

El servidor expone:

- `GET /api/scores?limit=10` → top 10
- `POST /api/scores` → guarda puntaje `{ name, score, seconds, moves, level }`

Los datos se guardan en `server/scores.json` (archivo plano).

### Despliegue rápido
- **Railway / Render**: crea un servicio Node, sube esta carpeta, define `start` como comando.
- **NGINX** (opcional): proxyear `/api` hacia el puerto del Node si sirves el `index.html` desde un hosting distinto.

### Integración con el Frontend
El `index.html` hace fetch a `/api/scores`. Si lo hospedas en un dominio distinto, ajusta `API_BASE` en el HTML.
