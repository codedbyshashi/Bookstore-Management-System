@echo off
setlocal

:: Maven Wrapper Script for Windows

set MAVEN_OPTS=-Xmx1024m -XX:MaxPermSize=256m

if "%JAVA_HOME%"=="" (
    echo "JAVA_HOME is not set. Please set it to your JDK installation directory."
    exit /b 1
)

set MAVEN_VERSION=3.8.1
set MAVEN_BIN=%~dp0apache-maven-%MAVEN_VERSION%\bin

if not exist "%MAVEN_BIN%\mvn.cmd" (
    echo "Maven not found. Downloading Maven %MAVEN_VERSION%..."
    call "%~dp0mvnw" -DskipTests
)

call "%MAVEN_BIN%\mvn.cmd" %*

endlocal
exit /b 0