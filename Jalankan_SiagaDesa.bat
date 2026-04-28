@echo off
title Menjalankan SiagaDesa...
echo ==============================================
echo       Memulai Sistem SiagaDesa
echo ==============================================

echo [1/2] Menyiapkan Backend FastAPI...
start cmd /k "cd backend && pip install -r requirements.txt && uvicorn main:app --reload"

echo [2/2] Membuka Frontend di Browser...
timeout /t 5 /nobreak >nul
start frontend\index.html

echo Sistem berhasil dijalankan.
echo Backend berjalan di: http://127.0.0.1:8000
echo Frontend akan terbuka di browser secara otomatis.
pause
