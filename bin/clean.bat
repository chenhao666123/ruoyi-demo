@echo off
echo.
echo [message] clean generate path.
echo.

%~d0
cd %~dp0

cd ..
call mvn clean

pause
