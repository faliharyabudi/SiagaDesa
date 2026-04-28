@echo off
title Menjalankan SiagaDesa (Mobile Expo)...
echo ==============================================
echo       Memulai Aplikasi Mobile SiagaDesa
echo ==============================================

echo [1/2] Menjalankan Backend API (Python)...
start cmd /k "cd backend && pip install -r requirements.txt && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Menjalankan Expo Server...
cd mobile
start cmd /k "npx expo start"

echo.
echo Server telah berjalan!
echo Silakan buka aplikasi "Expo Go" di HP Anda dan scan QR Code yang muncul di window Expo.
echo (Pastikan HP dan Komputer terhubung di jaringan WiFi yang sama).
pause
