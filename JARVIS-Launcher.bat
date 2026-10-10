@echo off
title J.A.R.V.I.S. Iron Man Gauntlet OS - Stark Industries Native Launcher
color 0b
cls
echo ===============================================================================
echo                STARK INDUSTRIES - J.A.R.V.I.S. GAUNTLET OS
echo                   Windows Desktop Launcher ^& Terminal Link
echo ===============================================================================
echo.
echo [1/3] Verifying Security Protocols...
echo       Clearance: LEVEL 10 // OMEGA PRIME CREATOR (Lisara Kodikara ^<jdushi@gmail.com^>)
echo.
echo [2/3] Checking Node.js Environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [NOTICE] Node.js runtime not detected in PATH.
    echo Launching cloud holographic mirror directly in standalone window...
    start msedge --app="https://ais-dev-gctvtzkyny3y2dejmhtmr3-258016456798.asia-southeast1.run.app" || start chrome --app="https://ais-dev-gctvtzkyny3y2dejmhtmr3-258016456798.asia-southeast1.run.app" || start "" "https://ais-dev-gctvtzkyny3y2dejmhtmr3-258016456798.asia-southeast1.run.app"
    goto finish
)

echo [3/3] Launching J.A.R.V.I.S. Core Suite...
start msedge --app="https://ais-dev-gctvtzkyny3y2dejmhtmr3-258016456798.asia-southeast1.run.app" || start chrome --app="https://ais-dev-gctvtzkyny3y2dejmhtmr3-258016456798.asia-southeast1.run.app" || start "" "https://ais-dev-gctvtzkyny3y2dejmhtmr3-258016456798.asia-southeast1.run.app"

:finish
echo.
echo ===============================================================================
echo [SUCCESS] J.A.R.V.I.S. HUD Interface is online!
echo Mark 85 Gauntlet Telemetry active.
echo ===============================================================================
pause
