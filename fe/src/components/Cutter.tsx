
import subtitles from '@/data/subtitles.json';
import { Alert, Button, Stack, Typography } from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import SubtitleTable from './SubtitleTable';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import KeyboardCapslockIcon from '@mui/icons-material/KeyboardCapslock';
import { useState } from 'react';

const secondsToTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}

const timeStampToSubtitle = (timestamp: number) => {
    return subtitles.findIndex((subtitle) => {
        return (timestamp >= subtitle.startTime && timestamp < subtitle.endTime)
    });
}

type CutterProps = {
    initialSubtitleId: number;
    timestamp: number;
};

const Cutter = ({ initialSubtitleId, timestamp }: CutterProps) => {
    const [firstSubtitleId, setFirstSubtitleId] = useState<number>(initialSubtitleId);
    const [lastSubtitleId, setLastSubtitleId] = useState<number>(initialSubtitleId);

    const handleSave = () => {
        const data = {
            start: firstSubtitleId,
            end: lastSubtitleId
        };

        fetch('https://babalaclips.fly.dev/cut', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            mode: 'cors'
        })
            .then(response => response.text())
            .then(url => {
                fetch(url, {
                    method: 'GET',
                    mode: 'cors'
                })
                    .then(response => response.blob())
                    .then(blob => {
                        console.log(blob);
                        const urlObject = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = urlObject;
                        link.download = "babalaclip.mp4";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            }
            );
    };

    const handleGoToVideoTimestamp = () => {
        const id = timeStampToSubtitle(timestamp);
        const tableRow = document.getElementById(`table-row-${id}`);
        tableRow?.scrollIntoView({ behavior: "auto", block: "center" });
        setFirstSubtitleId(id);
        setLastSubtitleId(id);
    }

    const handleWindowSlideDown = () => {
        if (lastSubtitleId < subtitles.length - 1) {
            setFirstSubtitleId(firstSubtitleId + 1);
            setLastSubtitleId(lastSubtitleId + 1);
        } else {
            alert("Zaten en alttaki aralığı seçtiniz, aşağıya doğru kaydıramazsınız.");
        }
    };

    const handleWindowSlideUp = () => {
        if (firstSubtitleId > 0) {
            setFirstSubtitleId(firstSubtitleId - 1);
            setLastSubtitleId(lastSubtitleId - 1);
        } else {
            alert("Zaten en üstteki aralığı seçtiniz, yukarıya doğru kaydıramazsınız.");
        }
    };

    const handleWindowExtendDown = () => {
        if (lastSubtitleId < subtitles.length - 1) {
            setLastSubtitleId(lastSubtitleId + 1);
        } else {
            alert("Zaten en alttaki aralığı seçtiniz, aşağıya doğru uzatmazsınız.");
        }
    };

    const handleWindowExtendUp = () => {
        if (firstSubtitleId > 0) {
            setFirstSubtitleId(firstSubtitleId - 1);
        } else {
            alert("Zaten en üstteki aralığı seçtiniz, yukarıya doğru uzatmazsınız.");
        }
    };

    const handleWindowShortenDown = () => {
        if (lastSubtitleId - firstSubtitleId > 0) {
            setLastSubtitleId(lastSubtitleId - 1);
        } else {
            alert("En az 1 aralık seçmelisiniz. Kısaltma işlemi tamamlanamadı.");
        }
    };

    const handleWindowShortenUp = () => {
        if (lastSubtitleId - firstSubtitleId > 0) {
            setFirstSubtitleId(firstSubtitleId + 1);
        } else {
            alert("En az 1 aralık seçmelisiniz. Kısaltma işlemi tamamlanamadı.");
        }
    };

    return (
        <>
            <SubtitleTable
                height={500}
                highlight={(_, index) => index >= firstSubtitleId && index <= lastSubtitleId}
            />
            <Typography
                variant="h6"
                component="div"
                sx={{ display: 'flex', height: '5vh' }}
            >
                Aralık: {secondsToTime(subtitles[firstSubtitleId].startTime)} - {secondsToTime(subtitles[lastSubtitleId].endTime)}
            </Typography>
            {
                subtitles[lastSubtitleId].endTime - subtitles[firstSubtitleId].startTime > 180 &&
                (<Alert severity="warning">3 dakikadan uzun aralık seçtiniz. Lütfen kısaltma işlemi yapın.</Alert>)
            }
            <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
                <Button
                    variant="outlined"
                    style={{ justifyContent: "left" }}
                    startIcon={<ArrowDownwardIcon />}
                    onClick={handleWindowSlideDown}>
                    Aşağıya Kaydır
                </Button>
                <Button
                    variant="outlined"
                    style={{ justifyContent: "left" }}
                    startIcon={<ArrowUpwardIcon />}
                    onClick={handleWindowSlideUp}>
                    Yukarıya Kaydır
                </Button>
                <Button
                    variant="outlined"
                    style={{ justifyContent: "left" }}
                    startIcon={<VerticalAlignBottomIcon />}
                    onClick={handleWindowExtendDown}>
                    Aşağıya Uzat
                </Button>
                <Button
                    variant="outlined"
                    style={{ justifyContent: "left" }}
                    startIcon={<VerticalAlignTopIcon />}
                    onClick={handleWindowExtendUp}>
                    Yukarıya Uzat
                </Button>
                <Button
                    variant="outlined"
                    style={{ justifyContent: "left" }}
                    startIcon={<KeyboardCapslockIcon />}
                    onClick={handleWindowShortenDown}>
                    Aşağıdan Kısalt
                </Button>
                <Button
                    variant="outlined"
                    style={{ justifyContent: "left" }}
                    startIcon={<KeyboardCapslockIcon style={{ transform: "rotate(180deg)" }} />}
                    onClick={handleWindowShortenUp}>
                    Yukarıdan Kısalt
                </Button>
                <Button
                    variant="contained"
                    style={{ justifyContent: "left", color: "white", backgroundColor: "#3f51b5" }}
                    startIcon={<KeyboardCapslockIcon style={{ transform: "rotate(180deg)" }} />}
                    onClick={handleGoToVideoTimestamp}>
                    Videodaki Ana Gel
                </Button>
                <Button
                    variant="contained"
                    disabled={subtitles[lastSubtitleId].endTime - subtitles[firstSubtitleId].startTime > 180}
                    style={{ justifyContent: "left", color: "white", backgroundColor: "#3f51b5" }}
                    startIcon={<SaveIcon />}
                    onClick={handleSave}>
                    Kaydet
                </Button>
            </Stack>
        </>
    );
};


export default Cutter;