# Global Trades: Supabase Keep-Alive Ping
# Pings the Supabase REST endpoint to prevent project auto-pausing on the free tier.

$apiUrl = "https://osfewvmfxbghayaefkve.supabase.co/rest/v1/products?select=id&limit=1"
$apiKey = "sb_publishable_34n8tcaN2jF3eJLYtpBlLA_xiriaDf8"

$headers = @{
    "apikey"        = $apiKey
    "Authorization" = "Bearer $apiKey"
}

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Headers $headers -Method Get -TimeoutSec 15
    $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    Write-Output "[$timestamp] Successfully pinged Supabase. Active record ID: $($response.id)"
} catch {
    Write-Warning "[$timestamp] Supabase ping encountered an issue: $_"
}
