@echo off
echo Attivazione ambiente virtuale...
call .\venv\Scripts\activate

echo Avvio dell'applicazione con ricaricamento automatico...
python run.py --reload

pause