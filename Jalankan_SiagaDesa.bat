@echo off
title Menjalankan SiagaDesa (Desktop App)...
echo ==============================================
echo       Memulai Aplikasi Desktop SiagaDesa
echo ==============================================

echo Menginstal dependensi (jika belum ada)...
pip install -r requirements.txt

echo.
echo Menjalankan aplikasi desktop...
python SiagaDesa_App.py

pause
