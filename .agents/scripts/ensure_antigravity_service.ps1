# Watchdog de Resiliencia para Antigravity IDE + Reanudación Automática de Servicio y CRONs (Estándar Maestro v4.0)
# Se ejecuta al iniciar sesión en Windows (AtLogOn) y cada 15 minutos en segundo plano.
# Si Windows se reinició por actualización de SO o si Antigravity.exe se cerró por actualización del IDE,
# relanza automáticamente Antigravity.exe en el workspace de Salones San Pedro Plus para que los Sidecars y el Hook SessionStart reanuden los CRONs.

$ErrorActionPreference = "SilentlyContinue"
$AntigravityExe = "C:\Users\info\AppData\Local\Programs\Antigravity\Antigravity.exe"
$WorkspacePath = "c:\Users\info\Documents\Desarrollo\SKILLS\Salones Classic"
$LogFile = Join-Path $WorkspacePath ".agents\state\watchdog_recovery.log"

function Write-WatchdogLog($Message) {
  $Timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
  $Line = "[$Timestamp] $Message"
  Add-Content -Path $LogFile -Value $Line -Encoding UTF8
}

# Verificar si hay un instalador de actualización de Antigravity corriendo en este instante
$InstallerProc = Get-Process | Where-Object { $_.ProcessName -match "AntigravitySetup|Update|squirrel" }
if ($InstallerProc) {
  Write-WatchdogLog "Actualización de IDE en curso detectada. Esperando 20 segundos antes de verificar..."
  Start-Sleep -Seconds 20
}

$Running = Get-Process -Name "Antigravity" -ErrorAction SilentlyContinue
if (-not $Running) {
  if (Test-Path $AntigravityExe) {
    Write-WatchdogLog "Antigravity.exe no estaba en ejecución (posible reinicio de SO o actualización de IDE). Relanzando servicio y CRONs automáticamente..."
    Start-Process -FilePath $AntigravityExe -ArgumentList "`"$WorkspacePath`"" -WorkingDirectory $WorkspacePath
    Start-Sleep -Seconds 5
    Write-WatchdogLog "Antigravity.exe relanzado exitosamente sobre workspace: $WorkspacePath"
  } else {
    Write-WatchdogLog "ERROR: No se encontró el binario en $AntigravityExe"
  }
}
