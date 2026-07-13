@echo off
echo ========================================
echo  SUDAN TIMES - MIGRATION TO NEXT.JS
echo ========================================
echo.

echo Step 1: Backup old structure...
if exist backup rd /s /q backup
mkdir backup
xcopy /E /I /Q backend backup\backend
xcopy /E /I /Q src backup\src
copy package.json backup\package.json.old
copy tsconfig.json backup\tsconfig.json.old 2>nul
echo Backup created in backup\ folder
echo.

echo Step 2: Replace pages directory...
if exist pages rd /s /q pages
move pages_new pages
echo Pages directory updated
echo.

echo Step 3: Replace package.json...
del package.json
ren package.json.new package.json
echo Package.json updated
echo.

echo Step 4: Clean up temporary files...
rd /s /q components_frontend 2>nul
rd /s /q components_backend 2>nul
echo Temporary files removed
echo.

echo Step 5: Copy environment variables...
copy backend\.env .env
echo Environment variables copied
echo.

echo ========================================
echo  MIGRATION COMPLETED
echo ========================================
echo.
echo Next steps:
echo   1. Run: npm install
echo   2. Run: npm run prisma:generate
echo   3. Run: npm run dev
echo.
echo The application is now a unified Next.js app!
echo.
pause
