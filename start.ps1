# JarvisOS - Start All Services
# Run this script with: .\start.ps1

Write-Host "🚀 Starting JarvisOS..." -ForegroundColor Cyan

# Start Ollama in new window
Write-Host "💻 Starting Ollama..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '💻 OLLAMA SERVER' -ForegroundColor Green; ollama serve"

# Wait a moment for Ollama to initialize
Start-Sleep -Seconds 2

# Start Backend in new window
Write-Host "🔧 Starting Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '🔧 JARVIS BACKEND' -ForegroundColor Cyan; cd '$PSScriptRoot' ; node backend\server.js"

# Wait a moment for Backend to start
Start-Sleep -Seconds 2

# Start Frontend in new window
Write-Host "🎨 Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '🎨 JARVIS FRONTEND' -ForegroundColor Magenta; cd '$PSScriptRoot\frontend' ; npm run dev"

Write-Host "`n✅ All services started!" -ForegroundColor Green
Write-Host "📡 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "`nPress any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
