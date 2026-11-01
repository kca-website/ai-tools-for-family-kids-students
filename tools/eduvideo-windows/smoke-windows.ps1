# Integration test on a real Windows GitHub-hosted runner. Requires built directory.
$ErrorActionPreference='Stop'
$packageRoot=Join-Path $PSScriptRoot 'dist\EduVideoStudio_Windows11'
$exe=Join-Path $packageRoot 'EduVideoStudio.exe'
$ffmpeg=Join-Path $packageRoot 'bin\ffmpeg.exe'
if (!(Test-Path $exe)) { throw 'No built executable.' }
# Generate PDF fixtures on the Windows builder; end users do not need Python.
& python -m pip install --disable-pip-version-check -q reportlab
if ($LASTEXITCODE -ne 0) {throw 'Build-only ReportLab dependency installation failed.'}
$generator=@'
import os
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
out=os.environ["RUNNER_TEMP"]
c=canvas.Canvas(os.path.join(out,'example.pdf'))
c.drawString(40,780,'The water cycle explains evaporation and condensation in nature.')
c.drawString(40,742,'Rain returns to rivers and seas.')
c.save()
pdfmetrics.registerFont(TTFont('GreekFont', r'C:\Windows\Fonts\arial.ttf'))
c=canvas.Canvas(os.path.join(out,'greek.pdf'))
c.setFont('GreekFont',15)
c.drawString(40,780,'Ο κύκλος του νερού περιγράφει τη φυσική κυκλοφορία του νερού.')
c.save()
'@
$generator | & python -
if ($LASTEXITCODE -ne 0) {throw 'Build-only PDF fixture generation failed.'}
# Exercise embedded PDF text extraction with both ordinary and Greek searchable PDFs.
foreach($case in @(@{name='greek'; token='νερού'},@{name='example';token='water'})) {
  $pdf=Join-Path $env:RUNNER_TEMP ($case.name+'.pdf')
  $extracted=Join-Path $env:RUNNER_TEMP ('pdf-'+$case.name+'.txt')
  if(!(Test-Path $pdf)) {throw ('Fixture not found: '+$pdf)}
  $p=Start-Process -FilePath $exe -ArgumentList ('--pdftext "'+$pdf+'" "'+$extracted+'"') -Wait -PassThru
  if($p.ExitCode -ne 0 -or !(Test-Path $extracted) -or !(Get-Content $extracted -Raw -Encoding UTF8).Contains($case.token)) {
    throw ('PDF extraction failed for '+$case.name)
  }
  Write-Host ('PASS: searchable '+$case.name+' PDF')
}
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
  [IO.File]::WriteAllText((Join-Path $job 'minutes.txt'),'1',[Text.Encoding]::UTF8)
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
  $info= & $ffmpeg -hide_banner -i $mp4 2>&1 | Out-String
  if ($info -notmatch 'Duration:\s*00:01:00\.00') {throw ('Duration not exactly 60.00 seconds for '+$case.lang+' '+$info)}
  Write-Host ('PASS: '+$case.lang+' animated 60s MP4 with SRT; size '+(Get-Item $mp4).Length)
}
Write-Host 'PASS: Greek+English Windows render tests.'