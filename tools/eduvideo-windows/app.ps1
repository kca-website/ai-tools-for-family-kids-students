# Diagnostic wrapper: show top-level PowerShell errors to the user.
try {
# EduVideo Studio v0.8 — Windows Forms (Windows 11 x64)
# Offline rendering via bundled Piper and FFmpeg; no downloads at runtime.
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.Windows.Forms.Application]::EnableVisualStyles()

$root=Join-Path $env:LOCALAPPDATA 'EduVideoStudio'
[System.IO.Directory]::CreateDirectory($root) | Out-Null
$culture= [System.Globalization.CultureInfo]::InvariantCulture
function Status([string]$text) { if ($env:EDUVIDEO_JOB_DIR) { [System.IO.File]::WriteAllText((Join-Path $env:EDUVIDEO_JOB_DIR 'status.txt'),$text,[System.Text.Encoding]::UTF8); return }; $lblStatus.Text=$text; $lblStatus.Refresh() }
function Info([string]$msg) { [System.Windows.Forms.MessageBox]::Show($form,$msg,'EduVideo Studio',[System.Windows.Forms.MessageBoxButtons]::OK,[System.Windows.Forms.MessageBoxIcon]::Information) | Out-Null }
function Warn([string]$msg) { [System.Windows.Forms.MessageBox]::Show($form,$msg,'EduVideo Studio',[System.Windows.Forms.MessageBoxButtons]::OK,[System.Windows.Forms.MessageBoxIcon]::Warning) | Out-Null }
function Read-Material([string]$path) {
    if ((Get-Item $path).Length -gt 32MB) { throw 'Το αρχείο ξεπερνά τα 8 MB.' }
    $ext=[System.IO.Path]::GetExtension($path).ToLowerInvariant()
    if ($ext -eq '.txt' -or $ext -eq '.md') { return [System.IO.File]::ReadAllText($path,[System.Text.Encoding]::UTF8) }
    if ($ext -eq '.pdf') {
        $temp=Join-Path $root ('pdf-'+[guid]::NewGuid().ToString('N')+'.txt')
        try {
            $exe=$env:EDUVIDEO_BIN
            if (!(Test-Path $exe)) {throw 'Δεν βρέθηκε ο ενσωματωμένος PDF extractor.'}
            $psi=New-Object System.Diagnostics.ProcessStartInfo
            $psi.FileName=$exe;$psi.Arguments='--pdftext "'+$path+'" "'+$temp+'"'
            $psi.UseShellExecute=$false;$psi.CreateNoWindow=$true;$psi.RedirectStandardError=$true
            $proc=[System.Diagnostics.Process]::Start($psi)
            $err=$proc.StandardError.ReadToEnd();$proc.WaitForExit()
            if ($proc.ExitCode -ne 0 -or !(Test-Path $temp)) {throw 'Δεν εξήχθη κείμενο από το PDF. Το PDF μπορεί να είναι σκαναρισμένο ή κρυπτογραφημένο. Απαιτείται PDF με επιλέξιμο κείμενο.'}
            $text=[IO.File]::ReadAllText($temp,[Text.Encoding]::UTF8)
            if ((Words $text) -lt 10) {throw 'Το PDF δεν περιέχει αρκετό επιλέξιμο κείμενο.'}
            return $text
        } finally {Remove-Item $temp -ErrorAction SilentlyContinue}
    }
    if ($ext -eq '.docx') {
        $zip=[System.IO.Compression.ZipFile]::OpenRead($path)
        try {
            $entry=$zip.GetEntry('word/document.xml')
            if (!$entry) { throw 'Το DOCX δεν περιέχει κείμενο.' }
            $stream=$entry.Open()
            try {
                $reader=New-Object System.IO.StreamReader($stream,[System.Text.Encoding]::UTF8)
                $xml=[xml]$reader.ReadToEnd()
                $manager=New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
                $manager.AddNamespace('w','http://schemas.openxmlformats.org/wordprocessingml/2006/main')
                $lines=New-Object 'System.Collections.Generic.List[string]'
                foreach($p in $xml.SelectNodes('//w:body//w:p',$manager)) {
                    $line=($p.SelectNodes('.//w:t',$manager) | ForEach-Object {$_.InnerText}) -join ''
                    if (![string]::IsNullOrWhiteSpace($line)) { $lines.Add($line) }
                }
                return $lines -join "`r`n"
            } finally { $stream.Dispose() }
        } finally { $zip.Dispose() }
    }
    throw 'Υποστηρίζονται TXT, MD, DOCX και PDF με επιλέξιμο κείμενο.'
}
function Words([string]$t) { return @([regex]::Matches($t,'\S+')).Count }
function Make-Plan([string]$source,[int]$minutes) {
    $clean=[regex]::Replace($source,'\s+',' ').Trim()
    if ((Words $clean) -lt 18) { throw 'Χρειάζονται τουλάχιστον 18 λέξεις ύλης.' }
    $sentences=@([regex]::Split($clean,'(?<=[.!?;;])\s+') | Where-Object { $_.Trim().Length -gt 5 })
    if ($sentences.Count -lt 2) { $sentences=@([regex]::Matches($clean,'.{1,200}(?=\s|$)') | ForEach-Object {$_.Value.Trim()}) }
    $maxWords=$minutes*112
    $used=0
    $selected=New-Object 'System.Collections.Generic.List[string]'
    foreach($sentence in $sentences) {
        $n=Words $sentence
        if (($used + $n) -gt $maxWords -and $used -gt 0) { break }
        $selected.Add($sentence.Trim()); $used+=$n
    }
    if ($selected.Count -eq 0) { $selected.Add($sentences[0]) }
    $scenes=[Math]::Min([Math]::Max(2,$minutes*2),[Math]::Max(2,$selected.Count))
    $sceneTexts=New-Object 'System.Collections.Generic.List[string]'
    for($i=0;$i -lt $scenes;$i++) {
        $start=[int][Math]::Floor($i*$selected.Count/$scenes)
        $end=[int][Math]::Floor(($i+1)*$selected.Count/$scenes)
        if ($end -le $start) { continue }
        $sceneTexts.Add(($selected.GetRange($start,$end-$start) -join ' '))
    }
    if ($sceneTexts.Count -eq 0) { $sceneTexts.Add(($selected -join ' ')) }
    return ($sceneTexts -join "`r`n`r`n")
}
function Assert-Components {
    $base=$env:EDUVIDEO_HOME
    if ([string]::IsNullOrWhiteSpace($base)) { throw 'Δεν έχει οριστεί ο φάκελος της εφαρμογής.' }
    foreach($file in @('bin\ffmpeg.exe','piper\piper.exe','voices\el_GR-rapunzelina-medium.onnx','voices\el_GR-rapunzelina-medium.onnx.json','voices\en_US-joe-medium.onnx','voices\en_US-joe-medium.onnx.json')) {
        if (!(Test-Path (Join-Path $base $file))) { throw 'Λείπει απαραίτητο ενσωματωμένο αρχείο: ' + $file + '. Αποσυμπίεσε ολόκληρο το πακέτο (όχι μόνο το EXE).' }
    }
}
function Invoke-Tool([string]$exe,[string[]]$arguments,[string]$label) {
    $psi=New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName=$exe
    $psi.Arguments=($arguments | ForEach-Object { '"'+($_ -replace '"','\\"')+'"' }) -join ' '
    $psi.UseShellExecute=$false
    $psi.CreateNoWindow=$true
    $psi.RedirectStandardError=$true
    $p=[System.Diagnostics.Process]::Start($psi)
    $err=$p.StandardError.ReadToEnd();$p.WaitForExit()
    if ($p.ExitCode -ne 0) { throw ($label+' απέτυχε (κωδικός '+$p.ExitCode+'). '+$err.Substring(0,[Math]::Min(1700,$err.Length))) }
}
function Invoke-Piper([string]$text,[string]$lang,[string]$wav) {
    $base=$env:EDUVIDEO_HOME
    $voice=if($lang -eq 'el'){'el_GR-rapunzelina-medium'}else{'en_US-joe-medium'}
    $exe=Join-Path $base 'piper\piper.exe';$model=Join-Path $base ('voices\'+$voice+'.onnx')
    $psi=New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName=$exe
    $psi.Arguments='--model "'+$model+'" --output_file "'+$wav+'"'
    $psi.WorkingDirectory=Split-Path $exe
    $psi.UseShellExecute=$false;$psi.CreateNoWindow=$true
    $psi.RedirectStandardInput=$true;$psi.RedirectStandardError=$true
    $proc=[System.Diagnostics.Process]::Start($psi)
    $utf8=[System.Text.UTF8Encoding]::new($false)
    $data=$utf8.GetBytes($text+"`n")
    $proc.StandardInput.BaseStream.Write($data,0,$data.Length)
    $proc.StandardInput.BaseStream.Flush()
    $proc.StandardInput.Close()
    $errors=$proc.StandardError.ReadToEnd()
    $proc.WaitForExit()
    if ($proc.ExitCode -ne 0 -or !(Test-Path $wav)) { throw ('Η ενσωματωμένη φωνή δεν λειτούργησε: '+$errors) }
}
function Wave-Seconds([string]$file) {
    $fs=[System.IO.File]::OpenRead($file)
    $br=New-Object System.IO.BinaryReader($fs)
    try {
        $fs.Seek(12,[System.IO.SeekOrigin]::Begin) | Out-Null
        [double]$byteRate=0; [double]$dataSize=0
        while($fs.Position -le $fs.Length-8) {
            $id=[System.Text.Encoding]::ASCII.GetString($br.ReadBytes(4))
            $length=$br.ReadUInt32(); $start=$fs.Position
            if ($id -eq 'fmt ') {
                if ($length -ge 12) { $fs.Position=$start+8; $byteRate=$br.ReadUInt32() }
            }
            if ($id -eq 'data') { $dataSize=$length; break }
            $fs.Position=$start+$length+($length%2)
        }
        if ($byteRate -le 0 -or $dataSize -le 0) { throw 'Μη αναγνωρίσιμο WAV από τη φωνή Windows.' }
        return [Math]::Max(0.5,$dataSize/$byteRate)
    } finally { $br.Dispose();$fs.Dispose() }
}
function Srt-Time([double]$seconds) {
    $ms=[Math]::Max(0,[int][Math]::Round($seconds*1000))
    $h=[int][Math]::Floor($ms/3600000);$ms=$ms%3600000
    $m=[int][Math]::Floor($ms/60000);$ms=$ms%60000
    $s=[int][Math]::Floor($ms/1000);$ms=$ms%1000
    return ('{0:00}:{1:00}:{2:00},{3:000}' -f $h,$m,$s,$ms)
}
function Get-Chunks([string]$text,[int]$max=80) {
    $results=New-Object 'System.Collections.Generic.List[string]'
    $line=''
    foreach($word in ($text -split '\s+')) {
        if (!$word) { continue }
        if ($line -and ($line.Length+1+$word.Length) -gt $max) { $results.Add($line); $line='' }
        if ($line) { $line+=' ' }
        $line+=$word
    }
    if ($line) { $results.Add($line) }
    return ,$results.ToArray()
}
function Short-Topic([string]$text,[int]$maximum=46) {
    $words=@($text -split '\s+' | Where-Object {$_})
    $r=($words | Select-Object -First 7) -join ' '
    if ($r.Length -gt $maximum) {$r=$r.Substring(0,$maximum-1).TrimEnd()+'…'}
    return $r
}
function Theme-Of([string]$text) {
    if($text -match 'εξάτμ|υδρατμ|κύκλ.{0,8}νερ|βροχ|σύννεφ|evaporat|water cycle') {return 'water'}
    if($text -match 'οικονομ|παραγωγ|συντελεστ|κεφάλαι|επιχειρηματ|economic|production') {return 'economy'}
    if($text -match 'καρδ|αιμοφορ|πνεύμον|αρτηρ|φλέβ|κυκλοφορικ|circulat|heart|blood') {return 'heart'}
    if($text -match 'φωτοσύνθ|χλωροφύλλ|διοξείδιο|photosynth|chlorophyll') {return 'plant'}
    return 'concept'
}
function Draw-Scene([string]$text,[int]$index,[int]$count,[string]$file,[string]$lang,[string]$caption='', [double]$phase=0.0,[double]$overall=0.0) {
    $bmp=New-Object System.Drawing.Bitmap(1280,720)
    $g=[System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint=[System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $bg=[System.Drawing.Color]::FromArgb(10,23,39)
    $ink=[System.Drawing.Color]::FromArgb(240,248,252)
    $muted=[System.Drawing.Color]::FromArgb(170,199,216)
    $teal=[System.Drawing.Color]::FromArgb(38,219,201)
    $sky=[System.Drawing.Color]::FromArgb(72,170,236)
    $orange=[System.Drawing.Color]::FromArgb(255,190,100)
    $green=[System.Drawing.Color]::FromArgb(87,213,156)
    $g.Clear($bg)
    $whiteBrush=New-Object System.Drawing.SolidBrush($ink)
    $secondaryBrush=New-Object System.Drawing.SolidBrush($muted)
    $accentBrush=New-Object System.Drawing.SolidBrush($teal)
    $blueBrush=New-Object System.Drawing.SolidBrush($sky)
    $warmBrush=New-Object System.Drawing.SolidBrush($orange)
    $greenBrush=New-Object System.Drawing.SolidBrush($green)
    $panelBrush=New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(19,45,67))
    $thinPen=New-Object System.Drawing.Pen($sky,5)
    $thinPen.StartCap=[System.Drawing.Drawing2D.LineCap]::Round
    $thinPen.EndCap=[System.Drawing.Drawing2D.LineCap]::Round
    $rayPen=[System.Drawing.Pen]::new($orange,3)
    $fSmall=New-Object System.Drawing.Font('Segoe UI',16,[System.Drawing.FontStyle]::Regular)
    $fTag=New-Object System.Drawing.Font('Segoe UI',15,[System.Drawing.FontStyle]::Bold)
    $fHeading=New-Object System.Drawing.Font('Segoe UI',24,[System.Drawing.FontStyle]::Bold)
    $fTitle=New-Object System.Drawing.Font('Segoe UI',21,[System.Drawing.FontStyle]::Regular)
    $fCaption=New-Object System.Drawing.Font('Segoe UI',18,[System.Drawing.FontStyle]::Bold)
    try {
        $g.FillRectangle($accentBrush,46,45,7,55)
        $h=if($lang -eq 'el'){'ΜΑΘΑΙΝΩ ΜΕ ΚΙΝΟΥΜΕΝΑ ΔΙΑΓΡΑΜΜΑΤΑ'}else{'LEARN THROUGH ANIMATED DIAGRAMS'}
        $g.DrawString($h,$fTag,$accentBrush,73,44)
        $g.DrawString((Short-Topic $text 70),$fHeading,$whiteBrush,73,78)
        $g.DrawString(('{0:00}  /  {1:00}' -f $index,$count),$fSmall,$secondaryBrush,1110,52)
        $g.FillRectangle($panelBrush,46,158,1188,416)
        # Teaching diagram, animated at six keyframes per second.
        $kind=Theme-Of $text
        $g.FillRectangle($panelBrush,56,166,1130,400)
        switch ($kind) {
            'water' {
                # Light, evaporating water, clouds, rain and runoff form a continuous physical cycle.
                $g.FillEllipse($warmBrush,198,211,91,91)
                for($j=0;$j -lt 10;$j++){$a=($j*36)*[Math]::PI/180;$x=243+[int](66*[Math]::Cos($a));$y=255+[int](66*[Math]::Sin($a));$g.DrawLine($rayPen,$x,$y,$x+[int](14*[Math]::Cos($a)),$y+[int](14*[Math]::Sin($a)))}
                $g.FillRectangle($blueBrush,110,492,725,52)
                for($j=0;$j -lt 3;$j++){$x=160+$j*170+[int](18*[Math]::Sin($phase*6.28+$j));$g.FillEllipse($whiteBrush,$x,498,66,6)}
                # Stylized white cloud
                foreach($c in @(@(590,248,100,72),@(660,224,132,94),@(753,256,105,68))){$g.FillEllipse($whiteBrush,$c[0],$c[1],$c[2],$c[3])}
                $g.FillRectangle($whiteBrush,605,284,233,35)
                for($j=0;$j -lt 7;$j++){
                    $y=320+[int]((($phase+$j/7.0)%1.0)*168)
                    $g.FillEllipse($blueBrush,645+$j*27,$y,10,18)
                    $x=310+[int](20*[Math]::Sin($j+$phase*5))
                    $yy=478-[int]((($phase+$j/7.0)%1.0)*155)
                    $g.FillEllipse($accentBrush,$x+$j*37,$yy,9,17)
                }
                $labA=if($lang -eq 'el'){'ΕΞΑΤΜΙΣΗ'}else{'EVAPORATION'}
                $labB=if($lang -eq 'el'){'ΣΥΜΠΥΚΝΩΣΗ'}else{'CONDENSATION'}
                $labC=if($lang -eq 'el'){'ΒΡΟΧΗ'}else{'RAINFALL'}
                $g.DrawString($labA,$fTag,$accentBrush,299,348)
                $g.DrawString($labB,$fTag,$secondaryBrush,635,201)
                $g.DrawString($labC,$fTag,$blueBrush,690,451)
            }
            'economy' {
                $items=if($lang -eq 'el'){@('ΓΗ','ΕΡΓΑΣΙΑ','ΚΕΦΑΛΑΙΟ','ΕΠΙΧΕΙΡΗΜΑΤΙΚΟΤΗΤΑ')}else{@('LAND','LABOUR','CAPITAL','ENTREPRENEURSHIP')}
                for($j=0;$j -lt 4;$j++){
                    $x=94+($j%2)*274;$y=215+[int][Math]::Floor($j/2)*166
                    $g.FillRectangle($blueBrush,$x,$y,238,118)
                    $g.DrawString($items[$j],$fTag,$whiteBrush,$x+12,$y+36)
                    $x1=$x+238;$y1=$y+59
                    $g.DrawLine($thinPen,$x1,$y1,748,365)
                    $t=($phase+$j/4.0)%1.0
                    $xx=$x1+[int]((748-$x1)*$t);$yy=$y1+[int]((365-$y1)*$t)
                    $g.FillEllipse($warmBrush,$xx-10,$yy-10,20,20)
                }
                $g.FillEllipse($greenBrush,745,279,176,176)
                $g.DrawString($(if($lang -eq 'el'){'ΠΑΡΑΓΩΓΗ'}else{'PRODUCTION'}),$fTag,$whiteBrush,756,344)
                $g.DrawLine($thinPen,923,366,1044,366)
                $g.DrawString($(if($lang -eq 'el'){'ΑΓΑΘΑ'}else{'GOODS'}),$fTag,$accentBrush,1044,319)
            }
            'heart' {
                # Cardiovascular circulation schematic: heart, lungs and body with moving oxygen markers.
                $red=New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240,105,123))
                $g.FillEllipse($red,450,294,180+[int](8*[Math]::Sin($phase*6.283)),180+[int](8*[Math]::Sin($phase*6.283)))
                $g.DrawString($(if($lang -eq 'el'){'ΚΑΡΔΙΑ'}else{'HEART'}),$fTag,$whiteBrush,484,363)
                $g.FillEllipse($blueBrush,137,302,190,145)
                $g.FillEllipse($blueBrush,765,302,190,145)
                $g.DrawString($(if($lang -eq 'el'){'ΠΝΕΥΜΟΝΕΣ'}else{'LUNGS'}),$fTag,$whiteBrush,147,346)
                $g.DrawString($(if($lang -eq 'el'){'ΣΩΜΑ'}else{'BODY'}),$fTag,$whiteBrush,814,346)
                $g.DrawLine($thinPen,324,369,449,369)
                $g.DrawLine($thinPen,630,369,766,369)
                for($j=0;$j -lt 6;$j++){$t=($phase+$j/6.0)%1.0;$xx=324+[int](444*$t);$g.FillEllipse($warmBrush,$xx,358,17,17)}
                $red.Dispose()
            }
            'plant' {
                $g.FillEllipse($warmBrush,165,213,100,100)
                $g.FillRectangle($greenBrush,558,358,13,150)
                $g.FillEllipse($greenBrush,424,278,175,103);$g.FillEllipse($greenBrush,568,268,170,108)
                for($j=0;$j -lt 10;$j++){$u=($phase+$j/10.0)%1.0;$x=276+[int](290*$u);$y=272+[int](150*$u);$g.FillEllipse($accentBrush,$x,$y,13,13)}
                $g.DrawString($(if($lang -eq 'el'){'ΗΛΙΑΚΟ ΦΩΣ'}else{'SUNLIGHT'}),$fTag,$warmBrush,140,352)
                $g.DrawString($(if($lang -eq 'el'){'ΦΩΤΟΣΥΝΘΕΣΗ'}else{'PHOTOSYNTHESIS'}),$fTag,$whiteBrush,754,339)
                $g.DrawString($(if($lang -eq 'el'){'ΝΕΡΟ + CO₂ → O₂'}else{'WATER + CO₂ → O₂'}),$fTag,$accentBrush,754,394)
            }
            default {
                # Neutral concept map: concepts are source excerpts, not invented scientific facts.
                $words=@([regex]::Matches($text,'[\p{L}]{5,}')|ForEach-Object {$_.Value.ToUpperInvariant()}|Select-Object -Unique -First 4)
                while($words.Count -lt 4){$words+=$(if($lang -eq 'el'){'ΕΝΝΟΙΑ'}else{'CONCEPT'})}
                for($j=0;$j -lt 4;$j++){
                    $x=98+($j%2)*460;$y=218+[int][Math]::Floor($j/2)*178
                    $g.FillRectangle($blueBrush,$x,$y,388,120)
                    $word=$words[$j];if($word.Length -gt 19){$word=$word.Substring(0,18)+'…'}
                    $g.DrawString($word,$fTitle,$whiteBrush,$x+15,$y+36)
                }
                $x=468+[int](92*[Math]::Cos($phase*2*[Math]::PI));$y=350+[int](70*[Math]::Sin($phase*2*[Math]::PI))
                $g.FillEllipse($warmBrush,$x,$y,21,21)
            }
        }
        $g.DrawString($(if($lang -eq 'el'){'ΠΗΓΗ: Η ΥΛΗ ΠΟΥ ΕΙΣΗΓΑΓΕΣ'}else{'SOURCE: THE PROVIDED MATERIAL'}),$fSmall,$secondaryBrush,75,537)
        $g.FillRectangle($panelBrush,46,587,1188,83)
        if($caption) {
            $caps=$caption.Trim();if($caps.Length -gt 125){$caps=$caps.Substring(0,124)+'…'}
            $g.DrawString($caps,$fCaption,$whiteBrush,([System.Drawing.RectangleF]::new(66,592,1140,70)))
        }
        $g.FillRectangle($accentBrush,46,684,[int](1188*[math]::Min(1,[math]::Max(0,$overall))),6)
        $bmp.Save($file,[System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
        foreach($obj in @($g,$bmp,$whiteBrush,$secondaryBrush,$accentBrush,$blueBrush,$warmBrush,$greenBrush,$panelBrush,$thinPen,$rayPen,$fSmall,$fTag,$fHeading,$fTitle,$fCaption)) {$obj.Dispose()}
    }
}
# Export worker runs separately, keeping the form responsive.
# Subtitles and slide changes are timed using proportional word lengths.
# This is approximate alignment, not word-accurate forced alignment.
function Validate-MP4([string]$ffmpeg,[string]$file,[int]$expected) {
    $psi=New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName=$ffmpeg;$psi.Arguments='-hide_banner -i "'+$file+'"'
    $psi.UseShellExecute=$false;$psi.RedirectStandardError=$true;$psi.CreateNoWindow=$true
    $p=[System.Diagnostics.Process]::Start($psi)
    $info=$p.StandardError.ReadToEnd();$p.WaitForExit()
    if($info -notmatch 'Duration:\s*(\d\d):(\d\d):(\d\d\.\d+)') {throw 'Δεν ήταν δυνατό να επαληθευτεί η διάρκεια του παραγόμενου MP4.'}
    $actual=[int]$Matches[1]*3600+[int]$Matches[2]*60+[double]::Parse($Matches[3],[Globalization.CultureInfo]::InvariantCulture)
    if([math]::Abs($actual-$expected) -gt 0.05) {throw ('Λανθασμένη διάρκεια αρχείου: '+$actual+' δευτ. αντί για '+$expected+'.')}
}
function Export-Video([string]$narration,[string]$lang,[string]$output,[int]$minutes) {
    Assert-Components
    if($minutes -notin @(1,2,3,4,5)) {throw 'Επίλεξε διάρκεια από 1 έως 5 λεπτά.'}
    $target=$minutes*60
    $scenes=@($narration -split '(?:\r?\n){2,}' | Where-Object {$_.Trim()})
    if ($scenes.Count -eq 0) {throw 'Δεν υπάρχει κείμενο αφήγησης.'}
    if ($scenes.Count -gt 40) {throw 'Μέγιστο 40 σκηνές.'}
    $work=Join-Path $root ('render-'+[Guid]::NewGuid().ToString('N'))
    [IO.Directory]::CreateDirectory($work)|Out-Null
    try {
        $ffmpeg=Join-Path $env:EDUVIDEO_HOME 'bin\ffmpeg.exe'
        $wavfiles=New-Object 'System.Collections.Generic.List[string]'
        $rawSeconds=New-Object 'System.Collections.Generic.List[double]'
        $rawTotal=0.0
        # Synthesize before rendering. Never cut off spoken narration to hit the duration.
        for($i=0;$i -lt $scenes.Count;$i++) {
            Status ('Αφήγηση: σκηνή {0}/{1}' -f ($i+1),$scenes.Count)
            $wave=Join-Path $work ('speech_{0:000}.wav' -f ($i+1))
            Invoke-Piper $scenes[$i] $lang $wave
            $sec=Wave-Seconds $wave
            if($sec -gt 240){throw 'Μία σκηνή διαρκεί πάνω από τέσσερα λεπτά. Χώρισε το κείμενο σε περισσότερες παραγράφους.'}
            $wavfiles.Add($wave);$rawSeconds.Add($sec);$rawTotal+=$sec
        }
        $speed=[math]::Max(1.0,$rawTotal/($target-0.08))
        if($speed -gt 1.25) {throw ('Το σενάριο είναι υπερβολικά μεγάλο για '+$minutes+' λεπτά. Η αφήγηση χρειάζεται '+[math]::Round($rawTotal)+' δευτ. Συντόμευσε το κείμενο και προσπάθησε ξανά. Δεν θα κοπεί η ομιλία.')}
        $audioList=New-Object 'System.Collections.Generic.List[string]'
        $videoList=New-Object 'System.Collections.Generic.List[string]'
        $sub=New-Object 'System.Collections.Generic.List[string]'
        $elapsed=0.0;$subtitleNo=0
        $fps=6
        $totalFrames=$fps*$target
        $writtenFrames=0
        $lastFrame=''
        for($i=0;$i -lt $scenes.Count;$i++) {
            $sec=$rawSeconds[$i]
            $slot=if($i -eq $scenes.Count-1){$target-$elapsed}else{$target*$sec/$rawTotal}
            $voiceEffective=[math]::Min($slot,$sec/$speed)
            # All scene audio is padded with silence rather than abruptly truncated.
            $wavTimed=Join-Path $work ('timed_{0:000}.wav' -f ($i+1))
            $slotText=$slot.ToString('0.000000',$culture)
            $speedText=$speed.ToString('0.000000',$culture)
            $af='atempo='+$speedText+',apad,atrim=duration='+$slotText
            Invoke-Tool $ffmpeg @('-hide_banner','-nostdin','-loglevel','error','-y','-i',$wavfiles[$i],'-af',$af,'-c:a','pcm_s16le','-ac','1',$wavTimed) 'Χρονισμός αφήγησης'
            $audioList.Add("file '"+(($wavTimed.Replace('\','/')) -replace "'","'\''")+"'")
            $chunks=@(Get-Chunks $scenes[$i] 76)
            $weights=@($chunks | ForEach-Object { [Math]::Max(1,(Words $_)) })
            $weightSum=0.0;foreach($w in $weights){$weightSum+=$w}
            $sofar=0.0
            for($j=0;$j -lt $chunks.Count;$j++){
                $d=if($j -eq $chunks.Count-1){$voiceEffective-$sofar}else{$voiceEffective*$weights[$j]/$weightSum}
                $d=[math]::Max(.001,$d)
                $subtitleNo++
                $sub.Add([string]$subtitleNo)
                $sub.Add((Srt-Time ($elapsed+$sofar))+' --> '+(Srt-Time ($elapsed+$sofar+$d)))
                $sub.Add($chunks[$j]);$sub.Add('')
                $sofar+=$d
            }
            $frames=if($i -eq $scenes.Count-1){$totalFrames-$writtenFrames}else{[math]::Max(1,[int][math]::Round($slot*$fps))}
            Status ('Κινούμενα γραφικά: σκηνή {0}/{1}' -f ($i+1),$scenes.Count)
            for($k=0;$k -lt $frames;$k++) {
                $timeInScene=$k/$fps
                $caption=''
                if($timeInScene -lt $voiceEffective -and $chunks.Count -gt 0) {
                    $captionIdx=[int][math]::Floor($timeInScene/[math]::Max(0.01,$voiceEffective)*$chunks.Count)
                    $caption=$chunks[[math]::Min($chunks.Count-1,$captionIdx)]
                }
                $phase=($timeInScene/5.0)%1.0
                $overall=($writtenFrames+$k)/[double]$totalFrames
                $image=Join-Path $work ('anim_{0:0000}_{1:0000}.png' -f ($i+1),$k)
                Draw-Scene $scenes[$i] ($i+1) $scenes.Count $image $lang $caption $phase $overall
                $videoList.Add("file '"+(($image.Replace('\','/')) -replace "'","'\''")+"'")
                $videoList.Add('duration 0.166666667')
                $lastFrame=$image
            }
            $writtenFrames+=$frames
            $elapsed+=$slot
        }
        # A duplicated last frame ensures concat keeps the final timed interval.
        $videoList.Add("file '"+(($lastFrame.Replace('\','/')) -replace "'","'\''")+"'")
        [IO.File]::WriteAllLines((Join-Path $work 'audio.txt'),$audioList,[Text.UTF8Encoding]::new($false))
        [IO.File]::WriteAllLines((Join-Path $work 'video.txt'),$videoList,[Text.UTF8Encoding]::new($false))
        $srt=Join-Path $work 'captions.srt'
        [IO.File]::WriteAllLines($srt,$sub,[Text.UTF8Encoding]::new($true))
        $merged=Join-Path $work 'narration.wav'
        Status 'Συγχρονισμός αφήγησης…'
        Invoke-Tool $ffmpeg @('-hide_banner','-nostdin','-loglevel','error','-y','-f','concat','-safe','0','-i',(Join-Path $work 'audio.txt'),'-c:a','pcm_s16le',$merged) 'Σύνθεση ήχου'
        Status ('Κωδικοποίηση MP4 '+$target+' δευτερολέπτων…')
        $tmpVideo=Join-Path $work 'lesson.mp4'
        Invoke-Tool $ffmpeg @('-hide_banner','-nostdin','-loglevel','error','-y','-f','concat','-safe','0','-i',(Join-Path $work 'video.txt'),'-i',$merged,'-map','0:v:0','-map','1:a:0','-vsync','cfr','-r','24','-frames:v',([string]($target*24)),'-af',('apad,atrim=duration='+$target),'-c:v','libx264','-preset','veryfast','-crf','21','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart','-t',([string]$target),$tmpVideo) 'Εξαγωγή MP4'
        if(!(Test-Path $tmpVideo) -or (Get-Item $tmpVideo).Length -lt 10000){throw 'Παρήχθη άδειο βίντεο.'}
        Validate-MP4 $ffmpeg $tmpVideo $target
        Copy-Item $tmpVideo $output -Force
        $outSrt=[IO.Path]::ChangeExtension($output,'.srt')
        Copy-Item $srt $outSrt -Force
        return @{video=$output;srt=$outSrt;duration=$target}
    } finally {Remove-Item $work -Recurse -Force -ErrorAction SilentlyContinue}
}
# Child-process worker: the desktop window stays responsive while audio/video is generated.
if (![string]::IsNullOrWhiteSpace($env:EDUVIDEO_JOB_DIR)) {
    try {
        $j=$env:EDUVIDEO_JOB_DIR
        $narration=[System.IO.File]::ReadAllText((Join-Path $j 'narration.txt'),[System.Text.Encoding]::UTF8)
        $lang=[System.IO.File]::ReadAllText((Join-Path $j 'lang.txt'),[System.Text.Encoding]::UTF8).Trim()
        $destination=[System.IO.File]::ReadAllText((Join-Path $j 'destination.txt'),[System.Text.Encoding]::UTF8).Trim()
        $minutes=[int][IO.File]::ReadAllText((Join-Path $j 'minutes.txt'),[Text.Encoding]::UTF8).Trim()
        $r=Export-Video $narration $lang $destination $minutes
        [System.IO.File]::WriteAllText((Join-Path $j 'success.txt'), ('Βίντεο: '+$r.video+"`r`n"+'Υπότιτλοι: '+$r.srt),[System.Text.Encoding]::UTF8)
    } catch {
        [System.IO.File]::WriteAllText((Join-Path $env:EDUVIDEO_JOB_DIR 'failure.txt'), ($_.Exception.ToString() + "`r`n" + $_.ScriptStackTrace),[System.Text.Encoding]::UTF8)
    }
    exit 0
}

$form=New-Object System.Windows.Forms.Form
$form.Text='EduVideo Studio · Animated PDF MP4 v0.8'
$form.StartPosition='CenterScreen';$form.Size=New-Object System.Drawing.Size(1150,790)
$form.MinimumSize=New-Object System.Drawing.Size(980,710)
$form.BackColor=[System.Drawing.Color]::FromArgb(13,27,43)
$form.ForeColor=[System.Drawing.Color]::White
$form.Font=New-Object System.Drawing.Font('Segoe UI',10)

$heading=New-Object System.Windows.Forms.Label
$heading.Text='EduVideo Studio';$heading.Font=New-Object System.Drawing.Font('Segoe UI',24,[System.Drawing.FontStyle]::Bold)
$heading.ForeColor=[System.Drawing.Color]::White
$heading.Location=New-Object System.Drawing.Point(25,15);$heading.Size=New-Object System.Drawing.Size(600,55)
$form.Controls.Add($heading)
$tag=New-Object System.Windows.Forms.Label
$tag.Text='Δωρεάν · EL/EN · MP4 + SRT · Τοπική επεξεργασία · Χωρίς API'
$tag.ForeColor=[System.Drawing.Color]::FromArgb(150,193,208)
$tag.Location=New-Object System.Drawing.Point(28,72);$tag.Size=New-Object System.Drawing.Size(900,24)
$form.Controls.Add($tag)
$leftHeader=New-Object System.Windows.Forms.Label
$leftHeader.Text='1. Κεφάλαιο / ύλη';$leftHeader.Location=New-Object System.Drawing.Point(30,113);$leftHeader.Size=New-Object System.Drawing.Size(450,25)
$form.Controls.Add($leftHeader)
$source=New-Object System.Windows.Forms.TextBox
$source.Multiline=$true;$source.ScrollBars='Vertical';$source.AcceptsReturn=$true
$source.Location=New-Object System.Drawing.Point(30,145);$source.Size=New-Object System.Drawing.Size(515,360)
$source.Anchor='Top,Left,Bottom';$source.Font=New-Object System.Drawing.Font('Segoe UI',11)
$form.Controls.Add($source)
$rightHeader=New-Object System.Windows.Forms.Label
$rightHeader.Text='2. Σενάριο αφήγησης — επεξεργάσιμο';$rightHeader.Location=New-Object System.Drawing.Point(565,113);$rightHeader.Size=New-Object System.Drawing.Size(520,25)
$form.Controls.Add($rightHeader)
$scriptBox=New-Object System.Windows.Forms.TextBox
$scriptBox.Multiline=$true;$scriptBox.ScrollBars='Vertical';$scriptBox.AcceptsReturn=$true
$scriptBox.Location=New-Object System.Drawing.Point(565,145);$scriptBox.Size=New-Object System.Drawing.Size(535,360)
$scriptBox.Anchor='Top,Left,Right,Bottom';$scriptBox.Font=New-Object System.Drawing.Font('Segoe UI',11)
$form.Controls.Add($scriptBox)
$btnOpen=New-Object System.Windows.Forms.Button
$btnOpen.Text='Άνοιγμα PDF / Word / TXT';$btnOpen.Location=New-Object System.Drawing.Point(30,518);$btnOpen.Size=New-Object System.Drawing.Size(180,38)
$btnOpen.Anchor='Bottom,Left';$form.Controls.Add($btnOpen)
$btnExample=New-Object System.Windows.Forms.Button
$btnExample.Text='Παράδειγμα';$btnExample.Location=New-Object System.Drawing.Point(220,518);$btnExample.Size=New-Object System.Drawing.Size(135,38)
$btnExample.Anchor='Bottom,Left';$form.Controls.Add($btnExample)
$lblDuration=New-Object System.Windows.Forms.Label
$lblDuration.Text='Διάρκεια';$lblDuration.Location=New-Object System.Drawing.Point(30,576);$lblDuration.Size=New-Object System.Drawing.Size(90,26)
$lblDuration.Anchor='Bottom,Left';$form.Controls.Add($lblDuration)
$duration=New-Object System.Windows.Forms.ComboBox
$duration.DropDownStyle='DropDownList';$duration.Location=New-Object System.Drawing.Point(123,573);$duration.Size=New-Object System.Drawing.Size(125,30)
$duration.Items.AddRange([object[]]@('1 λεπτό','2 λεπτά','3 λεπτά','4 λεπτά','5 λεπτά'));$duration.SelectedIndex=1
$duration.Anchor='Bottom,Left';$form.Controls.Add($duration)
$lblLang=New-Object System.Windows.Forms.Label
$lblLang.Text='Αφήγηση';$lblLang.Location=New-Object System.Drawing.Point(270,576);$lblLang.Size=New-Object System.Drawing.Size(80,26)
$lblLang.Anchor='Bottom,Left';$form.Controls.Add($lblLang)
$langChoice=New-Object System.Windows.Forms.ComboBox
$langChoice.DropDownStyle='DropDownList';$langChoice.Location=New-Object System.Drawing.Point(352,573);$langChoice.Size=New-Object System.Drawing.Size(194,30)
$langChoice.Items.AddRange([object[]]@('Ελληνικά','English'));$langChoice.SelectedIndex=0
$langChoice.Anchor='Bottom,Left';$form.Controls.Add($langChoice)
$btnPlan=New-Object System.Windows.Forms.Button
$btnPlan.Text='Δημιουργία σεναρίου';$btnPlan.Location=New-Object System.Drawing.Point(565,518);$btnPlan.Size=New-Object System.Drawing.Size(240,42)
$btnPlan.Anchor='Bottom,Left';$form.Controls.Add($btnPlan)
$btnExport=New-Object System.Windows.Forms.Button
$btnExport.Text='Εξαγωγή MP4';$btnExport.Location=New-Object System.Drawing.Point(818,518);$btnExport.Size=New-Object System.Drawing.Size(282,42)
$btnExport.BackColor=[System.Drawing.Color]::FromArgb(35,170,148);$btnExport.ForeColor=[System.Drawing.Color]::White
$btnExport.FlatStyle='Flat';$btnExport.Anchor='Bottom,Right';$form.Controls.Add($btnExport)
$note=New-Object System.Windows.Forms.Label
$note.Text='v0.8 · Κινούμενα διαγράμματα · PDF με επιλέξιμο κείμενο, Word, TXT · MP4 ακριβώς 1–5 λεπτών · Χωρίς AI σενάριο ή OCR.'
$note.ForeColor=[System.Drawing.Color]::FromArgb(155,185,199)
$note.Location=New-Object System.Drawing.Point(30,626);$note.Size=New-Object System.Drawing.Size(1060,48)
$note.Anchor='Bottom,Left,Right';$form.Controls.Add($note)
$lblStatus=New-Object System.Windows.Forms.Label
$lblStatus.Text='Έτοιμο. Επίλεξε αρχείο ή επικόλλησε εκπαιδευτικό κείμενο.'
$lblStatus.ForeColor=[System.Drawing.Color]::FromArgb(105,225,205)
$lblStatus.Location=New-Object System.Drawing.Point(30,692);$lblStatus.Size=New-Object System.Drawing.Size(1050,45)
$lblStatus.Anchor='Bottom,Left,Right';$form.Controls.Add($lblStatus)

$btnOpen.Add_Click({
    $dialog=New-Object System.Windows.Forms.OpenFileDialog
    $dialog.Filter='Έγγραφα|*.pdf;*.txt;*.md;*.docx|PDF|*.pdf|Όλα|*.*'
    if ($dialog.ShowDialog() -eq 'OK') {
        try { $source.Text=Read-Material $dialog.FileName;Status ('Φορτώθηκε: '+[IO.Path]::GetFileName($dialog.FileName)) }
        catch { Warn $_.Exception.Message }
    }
})
$btnExample.Add_Click({
    $source.Text='Ο κύκλος του νερού περιγράφει τη συνεχή μετακίνηση του νερού στη φύση. Η ενέργεια από τον Ήλιο προκαλεί εξάτμιση του νερού από θάλασσες, λίμνες και ποτάμια. Οι υδρατμοί ανεβαίνουν στην ατμόσφαιρα και καθώς ψύχονται συμπυκνώνονται σε μικροσκοπικά σταγονίδια. Έτσι δημιουργούνται τα σύννεφα. Όταν τα σταγονίδια μεγαλώσουν αρκετά, το νερό επιστρέφει στην επιφάνεια ως βροχή ή χιόνι. Ένα μέρος του νερού συγκεντρώνεται στα ποτάμια και στη θάλασσα. Ένα άλλο μέρος απορροφάται από το έδαφος και τροφοδοτεί τα υπόγεια νερά. Η διαδικασία συνεχίζεται και είναι απαραίτητη για τη ζωή και τα οικοσυστήματα.'
    Status 'Φορτώθηκε το παράδειγμα «Ο κύκλος του νερού».'
})
$btnPlan.Add_Click({
    try {
        $min=@(1,2,3,4,5)[$duration.SelectedIndex]
        $scriptBox.Text=Make-Plan $source.Text $min
        Status ('Σενάριο έτοιμο: '+(Words $scriptBox.Text)+' λέξεις. Μπορείς να το επεξεργαστείς.')
    } catch { Warn $_.Exception.Message }
})
$script:renderTimer=New-Object System.Windows.Forms.Timer
$script:renderTimer.Interval=400
$script:jobDir=''
$script:jobStart=[datetime]::MinValue
$script:renderProcess=$null
$script:renderTimer.Add_Tick({
    try {
        if (!$script:jobDir) { return }
        $statusPath=Join-Path $script:jobDir 'status.txt'
        if (Test-Path $statusPath) { $lblStatus.Text=[System.IO.File]::ReadAllText($statusPath,[System.Text.Encoding]::UTF8) }
        $successPath=Join-Path $script:jobDir 'success.txt'
        $failurePath=Join-Path $script:jobDir 'failure.txt'
        if (Test-Path $successPath) {
            $script:renderTimer.Stop()
            $btnExport.Enabled=$true;$btnPlan.Enabled=$true
            $msg=[System.IO.File]::ReadAllText($successPath,[System.Text.Encoding]::UTF8)
            $lblStatus.Text='Το βίντεο δημιουργήθηκε.'
            Info $msg
            $script:jobDir=''
        } elseif (Test-Path $failurePath) {
            $script:renderTimer.Stop()
            $btnExport.Enabled=$true;$btnPlan.Enabled=$true
            $msg=[System.IO.File]::ReadAllText($failurePath,[System.Text.Encoding]::UTF8)
            $lblStatus.Text='Η εξαγωγή απέτυχε.'
            Warn $msg
            $script:jobDir=''
        } elseif ($script:renderProcess -and $script:renderProcess.HasExited) {
            $script:renderTimer.Stop()
            $btnExport.Enabled=$true;$btnPlan.Enabled=$true
            $log=Join-Path $script:jobDir 'worker.log'
            $details=if (Test-Path $log) {[System.IO.File]::ReadAllText($log,[System.Text.Encoding]::UTF8)}else{'Δεν καταγράφηκαν λεπτομέρειες.'}
            Warn ('Η διαδικασία έκλεισε χωρίς αποτέλεσμα. Αναφορά: '+$log+"`r`n"+$details)
            $script:jobDir=''
        } elseif (([datetime]::Now-$script:jobStart).TotalMinutes -gt 30) {
            $script:renderTimer.Stop()
            $btnExport.Enabled=$true;$btnPlan.Enabled=$true
            Warn 'Η εξαγωγή ξεπέρασε τα 30 λεπτά. Δες το worker.log για λεπτομέρειες.'
            $script:jobDir=''
        }
    } catch { $lblStatus.Text='Παρακολούθηση εξαγωγής: '+$_.Exception.Message }
})
$btnExport.Add_Click({
    if ((Words $scriptBox.Text) -lt 10) { Warn 'Δημιούργησε πρώτα σενάριο με τουλάχιστον 10 λέξεις.';return }
    $save=New-Object System.Windows.Forms.SaveFileDialog
    $save.Title='Αποθήκευση εκπαιδευτικού βίντεο MP4';$save.Filter='MP4 βίντεο|*.mp4';$save.DefaultExt='mp4';$save.AddExtension=$true;$save.FileName='EduVideo_Lesson.mp4'
    if ($save.ShowDialog() -ne 'OK') {return}
    try {
        $job=Join-Path $root ('job-'+[Guid]::NewGuid().ToString('N'))
        [System.IO.Directory]::CreateDirectory($job) | Out-Null
        $encoding=New-Object System.Text.UTF8Encoding($true)
        [System.IO.File]::WriteAllText((Join-Path $job 'narration.txt'),$scriptBox.Text,$encoding)
        [System.IO.File]::WriteAllText((Join-Path $job 'destination.txt'),$save.FileName,$encoding)
        $chosen=if($langChoice.SelectedIndex -eq 0){'el'}else{'en'}
        [System.IO.File]::WriteAllText((Join-Path $job 'lang.txt'),$chosen,$encoding)
        [System.IO.File]::WriteAllText((Join-Path $job 'minutes.txt'),([string]@(1,2,3,4,5)[$duration.SelectedIndex]),$encoding)
        $btnExport.Enabled=$false;$btnPlan.Enabled=$false
        $script:jobDir=$job;$script:jobStart=[datetime]::Now
        $script:renderProcess=Start-Process -FilePath $env:EDUVIDEO_BIN -ArgumentList ('--render "'+$job+'"') -PassThru
        Status 'Η παραγωγή ξεκίνησε στο παρασκήνιο. Το παράθυρο παραμένει ενεργό.'
        $script:renderTimer.Start()
    } catch { $btnExport.Enabled=$true;$btnPlan.Enabled=$true;Warn $_.Exception.Message }
})
$form.Add_Shown({
    try {
        if (![string]::IsNullOrWhiteSpace($env:EDUVIDEO_READY_FILE)) {
            [System.IO.File]::WriteAllText($env:EDUVIDEO_READY_FILE, 'ready', [System.Text.Encoding]::UTF8)
        }
        $form.WindowState = [System.Windows.Forms.FormWindowState]::Normal
        $form.ShowInTaskbar = $true
        $form.BringToFront()
        $form.Activate() | Out-Null
    } catch {
        [System.Windows.Forms.MessageBox]::Show('Η εφαρμογή άνοιξε αλλά δεν καταγράφηκε η εκκίνηση: ' + $_.Exception.Message, 'EduVideo Studio') | Out-Null
    }
})
[System.Windows.Forms.Application]::Run($form)


} catch {
    $report = ($_ | Out-String) + [Environment]::NewLine + $_.ScriptStackTrace
    try {
        $dir = Join-Path $env:LOCALAPPDATA 'EduVideoStudio'
        [System.IO.Directory]::CreateDirectory($dir) | Out-Null
        [System.IO.File]::WriteAllText((Join-Path $dir 'app-error.txt'), $report)
    } catch { }
    try {
        Add-Type -AssemblyName System.Windows.Forms -ErrorAction SilentlyContinue
        [System.Windows.Forms.MessageBox]::Show("Η εφαρμογή δεν άνοιξε. Πληροφορίες στο EduVideoStudio\app-error.txt στον φάκελο AppData.\r\n\r\n" + $report, 'EduVideo Studio - Σφάλμα') | Out-Null
    } catch { }
    throw
}