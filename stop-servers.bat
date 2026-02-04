@echo off
echo Stopping all Node.js servers...
taskkill /F /IM node.exe 2>nul
echo All servers stopped!
pause
