# EduVideo Studio v0.7 reproducible Windows build.
# This script is for GitHub Actions developers ONLY. The end user never runs it.
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$src = $PSScriptRoot
$out = Join-Path $src 'dist\EduVideoStudio_Windows11'
$temp = Join-Path $env:RUNNER_TEMP ('EduVideoBuild-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path $temp,$out,(Join-Path $out 'bin'),(Join-Path $out 'voices') | Out-Null

function Download-Checked([string]$url,[string]$target,[long]$minBytes = 1000,[string]$md5='') {
  Write-Host ('DOWNLOADING: '+$url)
  $success=$false
  for ($i=1; $i -le 3 -and !$success; $i++) {
    try {
      Invoke-WebRequest -Uri $url -OutFile $target -MaximumRedirection 12 -UseBasicParsing -TimeoutSec 300
      if (!(Test-Path -LiteralPath $target) -or (Get-Item -LiteralPath $target).Length -lt $minBytes) {
        throw ('Incomplete download / bad size: '+$url)
      }
      if ($md5) {
        $actual=(Get-FileHash -Algorithm MD5 -LiteralPath $target).Hash.ToLowerInvariant()
        if ($actual -ne $md5.ToLowerInvariant()) { throw ('Model checksum mismatch: '+$actual+' expected '+$md5) }
      }
      $success=$true
    } catch {
      if ($i -eq 3) {throw}
      Write-Warning ('Attempt '+$i+' failed: '+$_.Exception.Message)
      Start-Sleep -Seconds (3*$i)
    }
  }
}

try {
  # Build Piper with all its Windows release DLLs and phonemizer data, not piper.exe only.
  $zip=Join-Path $temp 'piper.zip'
  Download-Checked 'https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_windows_amd64.zip' $zip 15000000
  $unpack=Join-Path $temp 'piper-unpack'
  Expand-Archive -LiteralPath $zip -DestinationPath $unpack -Force
  $pexe=Get-ChildItem -LiteralPath $unpack -Filter 'piper.exe' -File -Recurse | Select-Object -First 1
  if (!$pexe) { throw 'piper.exe was not in the Piper Windows release ZIP.' }
  Copy-Item -LiteralPath $pexe.Directory.FullName -Destination (Join-Path $out 'piper') -Recurse -Force
  if (!(Test-Path (Join-Path $out 'piper\piper.exe'))) { throw 'Piper folder layout check failed.' }
  if (!(Test-Path (Join-Path $out 'piper\espeak-ng-data'))) {
    $data=Get-ChildItem -Path (Join-Path $out 'piper') -Directory -Filter 'espeak-ng-data' -Recurse | Select-Object -First 1
    if (!$data) {throw 'Piper data files missing (espeak-ng-data).'}
  }

  # Static x64 Windows FFmpeg binary. Not downloaded by the desktop app.
  $ffzip=Join-Path $temp 'ffmpeg.zip'
  Download-Checked 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip' $ffzip 50000000
  $ffdir=Join-Path $temp 'ffmpeg-unpack'
  Expand-Archive -LiteralPath $ffzip -DestinationPath $ffdir -Force
  $fexe=Get-ChildItem -LiteralPath $ffdir -Filter 'ffmpeg.exe' -File -Recurse | Select-Object -First 1
  if (!$fexe) {throw 'ffmpeg.exe was not in archive.'}
  Copy-Item -LiteralPath $fexe.FullName -Destination (Join-Path $out 'bin\ffmpeg.exe') -Force

  # Voice-model digests are from rhasspy/piper-voices/voices.json.
  # Model cards are copied into the final package for provenance and attribution.
  $models=@(
    @{Name='el_GR-rapunzelina-medium'; Dir='el/el_GR/rapunzelina/medium'; MD5='265f2f9be00aa5ce81abc1f022145e42'; Bytes=62950044; Config='ba83ba13667e14e2f97fbc9d950f9583'},
    @{Name='en_US-joe-medium'; Dir='en/en_US/joe/medium'; MD5='74fd6a4dc39e0aa9dce145d7f5acd4f6'; Bytes=63201294; Config='811036b9c1451545f9495fdc1baa0754'}
  )
  foreach($m in $models) {
    $root='https://huggingface.co/rhasspy/piper-voices/resolve/main/'+$m.Dir+'/'
    Download-Checked ($root+$m.Name+'.onnx?download=true') (Join-Path $out ('voices\'+$m.Name+'.onnx')) $m.Bytes $m.MD5
    Download-Checked ($root+$m.Name+'.onnx.json?download=true') (Join-Path $out ('voices\'+$m.Name+'.onnx.json')) 1000 $m.Config
    Download-Checked ($root+'MODEL_CARD?download=true') (Join-Path $out ('voices\'+$m.Name+'.MODEL_CARD.txt')) 100
  }

  # Build self-contained launcher: it embeds the PowerShell UI/worker.
  Push-Location $src
  try {
    $env:GOOS='windows';$env:GOARCH='amd64';$env:CGO_ENABLED='0'
    & go build -trimpath -ldflags '-H windowsgui -s -w' -o (Join-Path $out 'EduVideoStudio.exe') launcher.go
    if ($LASTEXITCODE -ne 0) {throw 'Windows Go compilation failed.'}
  } finally {Pop-Location}
  Copy-Item (Join-Path $src 'README_FOR_WINDOWS.txt') (Join-Path $out 'ΔΙΑΒΑΣΕ_ΜΕ.txt')
  Copy-Item (Join-Path $src 'THIRD_PARTY_NOTICES.txt') (Join-Path $out 'THIRD_PARTY_NOTICES.txt')
  Copy-Item (Join-Path $src 'LICENSE_APP.txt') (Join-Path $out 'LICENSE_APP.txt')

  foreach($r in @('EduVideoStudio.exe','piper\piper.exe','bin\ffmpeg.exe','voices\el_GR-rapunzelina-medium.onnx','voices\en_US-joe-medium.onnx')) {
    if(!(Test-Path (Join-Path $out $r))){ throw ('Missing component: '+$r) }
  }
  $manifest=Get-ChildItem $out -Recurse -File | ForEach-Object { "{0}`t{1}`t{2}" -f $_.FullName.Substring($out.Length+1),$_.Length,(Get-FileHash -Algorithm SHA256 $_.FullName).Hash }
  [IO.File]::WriteAllLines((Join-Path $out 'FILE_MANIFEST_SHA256.tsv'),$manifest,[Text.Encoding]::UTF8)
  Write-Host ('COMPLETE PACKAGE: '+$out)
} finally {
  if (Test-Path $temp) {Remove-Item $temp -Recurse -Force -ErrorAction SilentlyContinue}
}