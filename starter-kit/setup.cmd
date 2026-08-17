@echo off
REM Double-clickable launcher for the AI-SDLC starter kit.
REM
REM Runs against the directory this kit sits in, which is what you want after copying starter-kit/
REM into a project. Pass --target=<dir> to point it somewhere else.

setlocal
cd /d "%~dp0.."

where node >nul 2>nul
if errorlevel 1 (
  echo Node 22 or newer is required, and no `node` was found on PATH.
  echo Install it from https://nodejs.org and run this again.
  pause
  exit /b 1
)

node "%~dp0setup.mjs" %*

REM Keep the window open when double-clicked, so the summary is readable.
if "%~1"=="" pause
