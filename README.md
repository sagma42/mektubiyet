
# My Letter App (Single-Port)
- Node.js + Express + SQLite
- Frontend, backend ile aynı porttan servis edilir.

## Çalıştırma
```bash
cd backend
npm install
npm start
```
Sonra tarayıcıda: http://localhost:3000

### Giriş Bilgileri
- Zeynep / şifre123
- Salih / lokum

### API
- POST `/login` { username, password }
- POST `/logout`
- POST `/letters/send` { receiver, content }
- GET `/letters/my`
- GET `/letters/all`  (yalnızca 23 Haziran 2026 sonrasında içerik verir)
