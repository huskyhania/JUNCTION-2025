# How to use

Run this stuff

docker run --name mockbank-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mockbank \
  -p 5432:5432 \
  -d postgres:16


1. Backend:
- add the .env in the backend folder and paste API KEY (it's on discord)
- run commands:
bash
```
npm install
node server.js
```

2. Frontend:
- run commands:
bash
```
npm install
npm run dev
``` 
# Features

Backend is making api calls to AI when it gets message from the front end.
 - You can change the model from line 29.
 - list of models https://featherless.ai/models .One of them might be better chat bot.
 - Currently the ai thinks its speaking to a child. You can change this from line 31.

Frontend is displaying:
- monthly balance 
- last 30 days cash flow

It uses hardcoded values, should be replaced by the ones from database.

Python script for starting backend and frontend all at once (should also work for mockbank if docker is up):
bash
```
python3 start.py
```

db inquiries
curl http://localhost:3001/health
curl http://localhost:3001/users

e.g.
curl http://localhost:3001/users/demo1/transactions

AI response log (powered by new Prisma model)  
```
curl http://localhost:3001/users/demo1/ai-responses
curl -X POST http://localhost:3001/users/demo1/ai-responses ^
  -H "Content-Type: application/json" ^
  -d "{\"prompt\":\"What should I do about groceries?\",\"response\":\"Cut impulse snacks by 20%.\",\"model\":\"meta-llama\",\"metadata\":{\"tags\":[\"groceries\"]}}"
```
Live chat replies from the frontend are now stored automatically through the backend WebSocket bridge, so `/users/:id/ai-responses` will grow as you talk to the coach.

After pulling changes run in `mockbank/`:
```
npm install
npx prisma migrate dev
npm run seed
```
to apply the new `AiResponse` table and sample insights.

## Environment quick reference

Backend (`backend/.env`):

```
API_KEY=...                # Featherless key
MOCKBANK_API_BASE=http://localhost:3001
MOCKBANK_USER_ID=demo1     # default user to associate chat replies with
CHAT_MODEL=meta-llama/Meta-Llama-3.1-8B-Instruct
```

MockBank (`mockbank/.env` add-on):

```
ALLOWED_ORIGINS=http://localhost:5173
```

Frontend (`frontend/.env`):

```
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000/
VITE_MOCKBANK_USER_ID=demo1
```

Adjust these if you deploy to different hosts/ports or want to test with another mock user.
