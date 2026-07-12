Write-Host "Starting server..."
Start-Job -Name "flora" -ScriptBlock {
    Set-Location $using:PWD
    npm run dev *> dev-log.txt
}
Start-Sleep -Seconds 12
Write-Host "Requesting homepage..."
try {
    Invoke-WebRequest http://localhost:5173/ -UseBasicParsing | Out-Null
    Write-Host "SUCCESS - page loaded fine"
} catch {
    Write-Host "FAILED - see error below"
    Write-Host $_.Exception.Message
}
Write-Host "----- SERVER LOG -----"
Get-Content dev-log.txt
Stop-Job -Name "flora"
Remove-Job -Name "flora"