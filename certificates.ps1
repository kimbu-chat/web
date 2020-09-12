Write-Host "Creating https certificate"

$certificate = New-SelfSignedCertificate -certstorelocation cert:\localmachine\my -dnsname localhost
$password = "AnyPassword"
$securePassword = ConvertTo-SecureString -String $password -Force -AsPlainText

$pfxPath = "./localhost.pfx"
$outPath = "./node_modules/webpack-dev-server/ssl/server.pem"
Export-PfxCertificate -Cert $certificate -FilePath $pfxPath -Password $securePassword | Out-Null
Import-PfxCertificate -Password $securePassword -FilePath $pfxPath -CertStoreLocation Cert:\LocalMachine\Root | Out-Null

$keyPath = "./localhost-key.pem"
$certPath = "./localhost.pem"

openssl pkcs12 -in $pfxPath -nocerts -out $keyPath -nodes -passin pass:$password
openssl pkcs12 -in $pfxPath -nokeys -out $certPath -nodes -passin pass:$password

$key = Get-Content ./localhost-key.pem
$cert = Get-Content ./localhost.pem
$key + $cert | Out-File $outPath -Encoding ASCII

Write-Host "Https certificate written to $outPath"