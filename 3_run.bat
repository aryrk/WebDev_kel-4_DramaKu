@echo off

start cmd /k "cd server && npm start"
start cmd /k "cd view && npm run dev"

start http://localhost:5173
