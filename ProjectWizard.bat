@echo off
set COMMAND=%0
set THIS_DIR=%~dp0



node "%THIS_DIR%\ProjectWizard.js" %1 %2


:ok
echo OK
goto eof

:error
echo Fail

:eof
if "%COMMAND:~2,1%" == ":" pause