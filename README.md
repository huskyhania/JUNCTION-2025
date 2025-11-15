# How to use

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
 - Currently the ai thinks its speaking to a child. You can change this from line 31.

Frontend is displaying:
- monthly balance 
- last 30 days cash flow

It uses hardcoded values, should be replaced by the ones from database.

Python script for starting backend and frontend all at once:
bash
```
python3 start.py
```
