@echo off
set THIS_DIR=%~dp0
cd /d %THIS_DIR%

set NAME=Project Wizard

set COMMAND=%THIS_DIR%ProjectWizard.bat
set COMMAND=%COMMAND:\=\\%

set REGF=Register.reg
echo create %REGF%


echo Windows Registry Editor Version 5.00 > %REGF%
echo. >> %REGF%


echo [HKEY_CLASSES_ROOT\Directory\Background\shell\ProjectWizard] >> %REGF%
echo @="%NAME%" >> %REGF%
echo. >> %REGF%
echo [HKEY_CLASSES_ROOT\Directory\Background\shell\ProjectWizard\command] >> %REGF%
echo @="\"%COMMAND%\"" >> %REGF%
echo. >> %REGF%


:eof




