@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao foi encontrado no PATH.
  echo Instale o Node.js ou execute um servidor HTTP estatico na raiz deste projeto.
  pause
  exit /b 1
)
start "" http://127.0.0.1:4173/demo/
npm run dev
