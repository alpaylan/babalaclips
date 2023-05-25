import { Alert, Box, Button, Grid, Modal, Paper, Stack, TableCell, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import { SubtitleData } from "./Subtitle";
import CutterTable from "./CutterTable";
import subtitles from "@/data/subtitles.json";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import KeyboardCapslockIcon from '@mui/icons-material/KeyboardCapslock';
import CloseIcon from '@mui/icons-material/Close';

type CutterProps = {
    open: boolean,
    handleClose: () => void,
    initialSubtitleId: number,
};

const secondsToTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}

const Cutter = ({ open, handleClose, initialSubtitleId }: CutterProps) => {
    const [firstSubtitleId, setFirstSubtitleId] = useState<number>(initialSubtitleId);
    const [lastSubtitleId, setLastSubtitleId] = useState<number>(initialSubtitleId);

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

    const windowFilter = (subtitles: SubtitleData[]) => {
        return subtitles.slice(firstSubtitleId, lastSubtitleId + 1)
    };


    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <Paper sx={{ p: 2, width: 250, height: 450 }}>
                            <Stack spacing={2} direction="column">
                                <Button variant="outlined" style={{justifyContent: "left"}} startIcon={<ArrowDownwardIcon />} onClick={handleWindowSlideDown}>Aşağıya Kaydır</Button>
                                <Button variant="outlined" style={{justifyContent: "left"}} startIcon={<ArrowUpwardIcon />} onClick={handleWindowSlideUp}>Yukarıya Kaydır</Button>
                                <Button variant="outlined" style={{justifyContent: "left"}} startIcon={<VerticalAlignBottomIcon />} onClick={handleWindowExtendDown}>Aşağıya Uzat</Button>
                                <Button variant="outlined" style={{justifyContent: "left"}} startIcon={<VerticalAlignTopIcon />} onClick={handleWindowExtendUp}>Yukarıya Uzat</Button>
                                <Button variant="outlined" style={{justifyContent: "left"}} startIcon={<KeyboardCapslockIcon />} onClick={handleWindowShortenDown}>Aşağıdan Kısalt</Button>
                                <Button variant="outlined" style={{justifyContent: "left"}} startIcon={<KeyboardCapslockIcon style={{ transform: "rotate(180deg)" }} />} onClick={handleWindowShortenUp}>Yukarıdan Kısalt</Button>
                                <Button variant="outlined" style={{justifyContent: "left"}} startIcon={<CloseIcon />} onClick={handleClose}>Kapat</Button>
                            </Stack>
                        </Paper>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <Paper sx={{ p: 2, width: 800, height: 700 }}>
                            <CutterTable interval={[firstSubtitleId, lastSubtitleId]} />
                            {
                                subtitles[lastSubtitleId].endTime - subtitles[firstSubtitleId].startTime > 180 &&
                                (<Alert severity="warning">3 dakikadan uzun aralık seçtiniz. Lütfen kısaltma işlemi yapın.</Alert>)
                            }
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default Cutter;