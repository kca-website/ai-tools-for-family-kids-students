# Diagnostic wrapper: show top-level PowerShell errors to the user.
try {
# EduVideo Studio v0.7 — Windows Forms (Windows 11 x64)
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
    if ((Get-Item $path).Length -gt 8MB) { throw 'Το αρχείο ξεπερνά τα 8 MB.' }
    $ext=[System.IO.Path]::GetExtension($path).ToLowerInvariant()
    if ($ext -eq '.txt' -or $ext -eq '.md') { return [System.IO.File]::ReadAllText($path,[System.Text.Encoding]::UTF8) }
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
    throw 'Επίλεξε TXT, MD ή DOCX. Για PDF αντέγραψε προσωρινά το κείμενο στο πεδίο ύλης.'
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
    $psi.StandardInputEncoding=[System.Text.UTF8Encoding]::new($false)
    $proc=[System.Diagnostics.Process]::Start($psi)
    $proc.StandardInput.WriteLine($text)
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
function Draw-Scene([string]$text,[int]$index,[int]$count,[string]$file,[string]$lang,[string]$caption='') {
    $bmp=New-Object System.Drawing.Bitmap(1280,720)
    $g=[System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint=[System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $rect=New-Object System.Drawing.Rectangle(0,0,1280,720)
    $c0=[System.Drawing.Color]::FromArgb(8,20,37);$c1=[System.Drawing.Color]::FromArgb(24,54,83)
    $brush=New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect,$c0,$c1,30)
    $g.FillRectangle($brush,$rect)
    $teal=New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(32,207,191))
    $white=New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(238,247,252))
    $muted=New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(172,193,211))
    $panel=New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(32,61,84))
    $g.FillRectangle($teal,85,100,9,85)
    $title=if($lang -eq 'el'){'ΕΚΠΑΙΔΕΥΤΙΚΟ ΒΙΝΤΕΟ'}else{'EDUCATIONAL VIDEO'}
    $font1=New-Object System.Drawing.Font('Segoe UI',22,[System.Drawing.FontStyle]::Bold)
    $font2=New-Object System.Drawing.Font('Segoe UI',31,[System.Drawing.FontStyle]::Regular)
    $font3=New-Object System.Drawing.Font('Segoe UI',16)
    $g.DrawString($title,$font1,$teal,110,102)
    $g.DrawString(('SCENE {0:00} / {1:00}' -f $index,$count),$font3,$muted,1060,112)
    $g.FillRectangle($panel,85,225,1110,340)
    $short=$text.Trim()
    if ($short.Length -gt 270) { $short=$short.Substring(0,267).Trim()+'…' }
    $layout=New-Object System.Drawing.RectangleF(117,255,1040,278)
    $g.DrawString($short,$font2,$white,$layout)
    # Burn subtitles into frames; each caption lasts for its own timed interval.
    if ($caption) {
        $captionBackground=New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(218,3,15,28))
        $captionFont=New-Object System.Drawing.Font('Segoe UI',20,[System.Drawing.FontStyle]::Bold)
        $g.FillRectangle($captionBackground,85,565,1110,76)
        $captionLayout=New-Object System.Drawing.RectangleF(104,574,1070,64)
        $g.DrawString($caption,$captionFont,$white,$captionLayout)
        $captionBackground.Dispose();$captionFont.Dispose()
    }
    $g.FillRectangle($teal,85,650,([int](1110*$index/$count)),7)
    $g.DrawString('EduVideo Studio · Local edition',$font3,$muted,86,664)
    $bmp.Save($file,[System.Drawing.Imaging.ImageFormat]::Png)
    foreach($obj in @($g,$bmp,$brush,$teal,$white,$muted,$panel,$font1,$font2,$font3)) { $obj.Dispose() }
}
# Export worker runs separately, keeping the form responsive.
# Subtitles and slide changes are timed using proportional word lengths.
# This is approximate alignment, not word-accurate forced alignment.
function Export-Video([string]$narration,[string]$lang,[string]$output) {
    Assert-Components
    $scenes=@($narration -split '(?:\r?\n){2,}' | Where-Object {$_.Trim()})
    if ($scenes.Count -eq 0) { throw 'Δεν υπάρχει κείμενο αφήγησης.' }
    if ($scenes.Count -gt 40) { throw 'Μέγιστο 40 σκηνές.' }
    $work=Join-Path $root ('render-'+[Guid]::NewGuid().ToString('N'))
    [System.IO.Directory]::CreateDirectory($work)|Out-Null
    try {
        $ffmpeg=Join-Path $env:EDUVIDEO_HOME 'bin\ffmpeg.exe'
        $sub=New-Object 'System.Collections.Generic.List[string]'
        $wavfiles=New-Object 'System.Collections.Generic.List[string]'
        $slidefiles=New-Object 'System.Collections.Generic.List[string]'
        $slideSeconds=New-Object 'System.Collections.Generic.List[double]'
        $time=0.0
        $subNo=0
        for($i=0;$i -lt $scenes.Count;$i++) {
            Status ('Αφήγηση: σκηνή {0}/{1}' -f ($i+1),$scenes.Count)
            $wave=Join-Path $work ('speech_{0:000}.wav' -f ($i+1))
            Invoke-Piper $scenes[$i] $lang $wave
            $sec=Wave-Seconds $wave
            if($sec -gt 240){ throw 'Η σκηνή ξεπερνά τα 4 λεπτά. Χώρισε το κείμενο σε μικρότερες παραγράφους.' }
            $wavfiles.Add($wave)
            # Show one short caption at a time, not a 200-word paragraph.
            $chunks=@(Get-Chunks $scenes[$i] 76)
            if ($chunks.Count -eq 0) { $chunks=@($scenes[$i]) }
            $weights=@($chunks | ForEach-Object { [math]::Max(1,(Words $_)) })
            $totalWords=0.0
            foreach($w in $weights){$totalWords+=$w}
            $elapsed=0.0
            for($j=0;$j -lt $chunks.Count;$j++) {
                $duration=if($j -eq $chunks.Count-1) {$sec-$elapsed} else {$sec*$weights[$j]/$totalWords}
                $duration=[math]::Max(0.001,$duration)
                $slide=Join-Path $work ('slide_{0:000}_{1:000}.png' -f ($i+1),($j+1))
                Draw-Scene $scenes[$i] ($i+1) $scenes.Count $slide $lang $chunks[$j]
                $slidefiles.Add($slide)
                $slideSeconds.Add($duration)
                $subNo++
                $sub.Add([string]$subNo)
                $sub.Add((Srt-Time ($time+$elapsed))+' --> '+(Srt-Time ($time+$elapsed+$duration)))
                $sub.Add($chunks[$j]);$sub.Add('')
                $elapsed+=$duration
            }
            $time+=$sec
        }
        $srt=Join-Path $work 'captions.srt'
        [IO.File]::WriteAllLines($srt,$sub,([Text.UTF8Encoding]::new($true)))
        $alist=New-Object 'System.Collections.Generic.List[string]'
        $vlist=New-Object 'System.Collections.Generic.List[string]'
        foreach($wave in $wavfiles){$alist.Add("file '"+(($wave.Replace('\','/')) -replace "'","'\\''")+"'")}
        for($i=0;$i -lt $slidefiles.Count;$i++) {
            $vlist.Add("file '"+(($slidefiles[$i].Replace('\','/')) -replace "'","'\\''")+"'")
            $vlist.Add('duration '+$slideSeconds[$i].ToString('0.000000',$culture))
        }
        $vlist.Add("file '"+(($slidefiles[$slidefiles.Count-1].Replace('\','/')) -replace "'","'\\''")+"'")
        [IO.File]::WriteAllLines((Join-Path $work 'audio.txt'),$alist,([Text.UTF8Encoding]::new($false)))
        [IO.File]::WriteAllLines((Join-Path $work 'video.txt'),$vlist,([Text.UTF8Encoding]::new($false)))
        $merged=Join-Path $work 'narration.wav'
        Status 'Σύνθεση ήχου…'
        Invoke-Tool $ffmpeg @('-hide_banner','-nostdin','-loglevel','error','-y','-f','concat','-safe','0','-i',(Join-Path $work 'audio.txt'),'-c:a','pcm_s16le',$merged) 'Σύνθεση ήχου'
        Status 'Παραγωγή MP4…'
        $tmpVideo=Join-Path $work 'movie.mp4'
        Invoke-Tool $ffmpeg @('-hide_banner','-nostdin','-loglevel','error','-y','-f','concat','-safe','0','-i',(Join-Path $work 'video.txt'),'-i',$merged,'-r','24','-c:v','libx264','-preset','veryfast','-crf','24','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart','-shortest',$tmpVideo) 'Εξαγωγή MP4'
        if(!(Test-Path $tmpVideo) -or (Get-Item $tmpVideo).Length -lt 5000){throw 'Παρήχθη άδειο βίντεο.'}
        Copy-Item $tmpVideo $output -Force
        $outSrt=[IO.Path]::ChangeExtension($output,'.srt')
        Copy-Item $srt $outSrt -Force
        return @{video=$output;srt=$outSrt;duration=$time}
    }finally{Remove-Item $work -Recurse -Force -ErrorAction SilentlyContinue}
}

# Child-process worker: the desktop window stays responsive while audio/video is generated.
if (![string]::IsNullOrWhiteSpace($env:EDUVIDEO_JOB_DIR)) {
    try {
        $j=$env:EDUVIDEO_JOB_DIR
        $narration=[System.IO.File]::ReadAllText((Join-Path $j 'narration.txt'),[System.Text.Encoding]::UTF8)
        $lang=[System.IO.File]::ReadAllText((Join-Path $j 'lang.txt'),[System.Text.Encoding]::UTF8).Trim()
        $destination=[System.IO.File]::ReadAllText((Join-Path $j 'destination.txt'),[System.Text.Encoding]::UTF8).Trim()
        $r=Export-Video $narration $lang $destination
        [System.IO.File]::WriteAllText((Join-Path $j 'success.txt'), ('Βίντεο: '+$r.video+"`r`n"+'Υπότιτλοι: '+$r.srt),[System.Text.Encoding]::UTF8)
    } catch {
        [System.IO.File]::WriteAllText((Join-Path $env:EDUVIDEO_JOB_DIR 'failure.txt'), ($_.Exception.ToString() + "`r`n" + $_.ScriptStackTrace),[System.Text.Encoding]::UTF8)
    }
    exit 0
}

$form=New-Object System.Windows.Forms.Form
$form.Text='EduVideo Studio · Portable MP4 v0.7'
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
$btnOpen.Text='Άνοιγμα TXT / Word';$btnOpen.Location=New-Object System.Drawing.Point(30,518);$btnOpen.Size=New-Object System.Drawing.Size(180,38)
$btnOpen.Anchor='Bottom,Left';$form.Controls.Add($btnOpen)
$btnExample=New-Object System.Windows.Forms.Button
$btnExample.Text='Παράδειγμα';$btnExample.Location=New-Object System.Drawing.Point(220,518);$btnExample.Size=New-Object System.Drawing.Size(135,38)
$btnExample.Anchor='Bottom,Left';$form.Controls.Add($btnExample)
$lblDuration=New-Object System.Windows.Forms.Label
$lblDuration.Text='Διάρκεια';$lblDuration.Location=New-Object System.Drawing.Point(30,576);$lblDuration.Size=New-Object System.Drawing.Size(90,26)
$lblDuration.Anchor='Bottom,Left';$form.Controls.Add($lblDuration)
$duration=New-Object System.Windows.Forms.ComboBox
$duration.DropDownStyle='DropDownList';$duration.Location=New-Object System.Drawing.Point(123,573);$duration.Size=New-Object System.Drawing.Size(125,30)
$duration.Items.AddRange([object[]]@('1 λεπτό','2 λεπτά','3 λεπτά','5 λεπτά'));$duration.SelectedIndex=1
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
$note.Text='Η έκδοση 0.7 χρησιμοποιεί τοπική αφήγηση Piper και MP4. Η σύνθεση του σεναρίου ΔΕΝ είναι γενετική AI. TXT, MD, DOCX και επικόλληση.'
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
    $dialog.Filter='Κείμενο / Word|*.txt;*.md;*.docx|Όλα|*.*'
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
        $min=@(1,2,3,5)[$duration.SelectedIndex]
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