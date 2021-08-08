@echo off
echo.
echo [message] package Web Project, generate war/jar
echo.

%~d0
cd %~dp0

cd ..
call mvn clean package -Dmaven.test.skip=true

pause
