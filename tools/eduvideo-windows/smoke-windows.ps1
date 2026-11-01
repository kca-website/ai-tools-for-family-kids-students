# Integration test on a real Windows GitHub-hosted runner. Requires built directory.
$ErrorActionPreference='Stop'
$home=Join-Path $PSScriptRoot 'dist\EduVideoStudio_Windows11'
$exe=Join-Path $home 'EduVideoStudio.exe'
$ffmpeg=Join-Path $home 'bin\ffmpeg.exe'
if (!(Test-Path $exe)) { throw 'No built executable.' }
$testRoot=Join-Path $env:RUNNER_TEMP 'eduvideo-integration'
New-Item -ItemType Directory -Force -Path $testRoot | Out-Null

$cases=@(
  @{lang='el'; text='Ο κύκλος του νερού περιγράφει τη συνεχή κυκλοφορία του νερού στη φύση. Ο ήλιος προκαλεί την εξάτμιση και ο αέρας μεταφέρει τους υδρατμούς. Τα σύννεφα σχηματίζονται όταν ο αέρας ψύχεται.'},
  @{lang='en'; text='The water cycle describes the continuous movement of water on Earth. Sunlight causes water to evaporate. Water vapor cools, condenses into clouds, and later falls as rain.'}
)
foreach ($case in $cases) {
  $job=Join-Path $testRoot ('job-'+$case.lang)
  New-Item -ItemType Directory -Force -Path $job | Out-Null
  $mp4=Join-Path $job ('smoke-'+$case.lang+'.mp4')
  [IO.File]::WriteAllText((Join-Path $job 'narration.txt'),$case.text,[Text.Encoding]::UTF8)
  [IO.File]::WriteAllText((Join-Path $job 'lang.txt'),$case.lang,[Text.Encoding]::UTF8)
  [IO.File]::WriteAllText((Join-Path $job 'destination.txt'),$mp4,[Text.Encoding]::UTF8)
  Write-Host ('Rendering '+$case.lang+' video...')
  $child=Start-Process -FilePath $exe -ArgumentList ('--render "'+$job+'"') -PassThru -Wait
  if (!(Test-Path (Join-Path $job 'success.txt'))) {
    Get-Content (Join-Path $job 'failure.txt') -ErrorAction SilentlyContinue | Write-Host
    Get-Content (Join-Path $job 'worker.log') -ErrorAction SilentlyContinue | Write-Host
    throw ('MP4 render failed for '+$case.lang)
  }
  if (!(Test-Path $mp4) -or (Get-Item $mp4).Length -lt 10000) {throw ('Empty MP4: '+$mp4)}
  $srt=[IO.Path]::ChangeExtension($mp4,'.srt')
  if (!(Test-Path $srt) -or (Get-Item $srt).Length -lt 100) {throw 'No SRT subtitles.'}
  & $ffmpeg -hide_banner -v error -i $mp4 -f null NUL
  if ($LASTEXITCODE -ne 0) {throw 'FFmpeg cannot decode the MP4.'}
  Write-Host ('PASS: '+$case.lang+' video with SRT; size '+(Get-Item $mp4).Length)
}
Write-Host 'PASS: Greek+English Windows render tests.'