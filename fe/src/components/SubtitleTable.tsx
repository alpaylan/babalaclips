
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { SubtitleData } from "@/components/Subtitle";
import subtitles from "@/data/subtitles.json";
import { useEffect } from 'react';

export type SubtitleTableProps = {
    height?: number,
    scrollEnabled?: boolean,
    scrollSelected?: boolean,
    currentTimestamp?: number,
    filter?: (subtitles: SubtitleData[]) => SubtitleData[],
    highlight?: (subtitles: SubtitleData, index: number) => boolean,
    setPlayerTime?: (time: number) => void,
};

const secondsToTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}

const SubtitleTable = ({ 
    height,
    scrollEnabled = true,
    scrollSelected = false,
    currentTimestamp,
    filter,
    highlight = () => false,
    setPlayerTime = () => {},
}: SubtitleTableProps) => {
    const subtitlesToDisplay = filter ? filter(subtitles) : subtitles;
    const flooredTimestamp = Math.floor(currentTimestamp || 0); //prevent rerendering on every millisecond

    useEffect(() => {
        if (scrollEnabled && scrollSelected) {
            const selectedSubtitle = subtitlesToDisplay.find(subtitle => currentTimestamp && currentTimestamp >= subtitle.startTime && currentTimestamp < subtitle.endTime);
            if (selectedSubtitle) {
                const selectedSubtitleIndex = subtitlesToDisplay.indexOf(selectedSubtitle);
                const tableRow = document.getElementById(`table-row-${selectedSubtitleIndex}`);
                tableRow?.scrollIntoView({ behavior: "auto", block: "center" });
            }
        }
    }, [currentTimestamp, flooredTimestamp, scrollEnabled, scrollSelected, subtitlesToDisplay]);

    return (
        <div style={{
            height: height ? height : "100%",
            overflow: scrollEnabled ? "scroll" : "hidden",
        }} >
        <Table>
            <TableBody>
                {subtitlesToDisplay.map((subtitle, index) => (
                    <TableRow
                        id={`table-row-${index}`}
                        key={index}
                        onClick={() => setPlayerTime(subtitle.startTime)}
                        sx={{
                            backgroundColor: highlight(subtitle, index) ? "yellow" : "transparent",
                            "&:hover": {
                                backgroundColor: "lightgray",
                                cursor: "pointer",
                            }
                        }}
                    >
                        <TableCell>{secondsToTime(subtitle.startTime)} - {secondsToTime(subtitle.endTime)}</TableCell>
                        <TableCell>{subtitle.text}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </div>
    );
}

export default SubtitleTable;