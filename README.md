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

Python script for starting backend and frontend all at once (should also work for mockback if docker is up):
bash
```
python3 start.py
```

db inquiries
curl http://localhost:3001/health
curl http://localhost:3001/users

e.g.
curl http://localhost:3001/users/demo1/transactions