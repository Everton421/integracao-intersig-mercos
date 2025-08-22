@echo off
chcp 65001 > NUL
title Conectar Impressoras na Inicialização
echo =======================================================================================
echo =======================================================================================
echo                                  INTERSIG SISTEMAS®
echo =======================================================================================
echo ———————————————————————————————————————————————————————————————————————————————————————
echo                         Conector de impressoras automatico
echo ———————————————————————————————————————————————————————————————————————————————————————
echo ======================================================================================= 
date /t >> log.txt
time /t >> log.txt
echo. >> log.txt
REM Conectar Impressora Samsung M2020
echo.
echo %date% %time% - Adicionando as Credenciais do Usuario.
cmdkey /add:\\26.18.15.218 /user:administrador /pass:Savitur@2023 > NUL
if %errorlevel% neq 0 (
  echo Erro ao adicionar a Credencial. >> log.txt
)
echo.
echo %date% %time% - Conectando impressora Samsung M2020
echo %date% %time% - Conectando... >> log.txt
rundll32 printui.dll,PrintUIEntry /in /n "\\26.18.15.218\Samsung M2020" >> log.txt 2>&1
if %errorlevel% neq 0 (
  echo Erro ao conectar a impressora Samsung M2020 >> log.txt
)
echo %date% %time% - Impressora Samsung M2020 Incluida com sucesso!
echo =======================================================================================
REM Conectar Impressora HP Laser 103 107 108
echo.
echo %date% %time% - Adicionando as Credenciais do Usuario.
cmdkey /add:\\26.183.65.189 /user:administrador /pass:Savitur@2023 > NUL
if %errorlevel% neq 0 (
  echo Erro ao adicionar a Credencial. >> log.txt
)
echo.
echo %date% %time% - Conectando impressora HP Laser 103 107 108
echo %date% %time% - Conectando... >> log.txt
rundll32 printui.dll,PrintUIEntry /in /n "\\26.183.65.189\HP Laser 103 107 108" >> log.txt 2>&1
if %errorlevel% neq 0 (
  echo Erro ao conectar a impressora HP Laser 103 107 108 >> log.txt
)
echo %date% %time% - Impressora HP Laser 103 107 108 Incluida com sucesso!
echo =======================================================================================
REM Conectar Impressora HP LaserJet 1015
echo.
echo %date% %time% - Adicionando as Credenciais do Usuario.
cmdkey /add:\\26.24.22.49 /user:administrador /pass:Savitur@2023 > NUL
if %errorlevel% neq 0 (
  echo Erro ao adicionar a Credencial. >> log.txt
)
echo.
echo %date% %time% - Conectando impressora HP LaserJet 1015
echo %date% %time% - Conectando... >> log.txt
rundll32 printui.dll,PrintUIEntry /in /n "\\26.24.22.49\HP LaserJet 1015" >> log.txt 2>&1
if %errorlevel% neq 0 (
  echo Erro ao conectar a impressora HP LaserJet 1015 >> log.txt
)
echo %date% %time% - Impressora HP LaserJet 1015 Incluida com sucesso!
echo =======================================================================================
echo %date% %time% - Todas as Impressoras foram conectadas com sucesso. >> log.txt
echo. >> log.txt
pause
exit