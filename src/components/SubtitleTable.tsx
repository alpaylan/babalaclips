
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { SubtitleData } from "@/components/Subtitle";

export type SubtitleTableProps = {
    subtitles: SubtitleData[],
    filter: (subtitles: SubtitleData[]) => SubtitleData[],
    setPlayerTime: (time: number) => void,
    currentTimestamp?: number,
};

const formatTime = (time: number) => {
    return new Date(time * 1000).toISOString().slice(11, 19);
}

const getBackGroundColor = (startTime: number, endTime: number, currentTimestamp?: number) => {
    if (currentTimestamp && currentTimestamp >= startTime && currentTimestamp < endTime) {
        return "yellow";
    }
    return "white";
}


const SubtitleTable = ({ subtitles, filter, currentTimestamp, setPlayerTime }: SubtitleTableProps) => {
    const subtitlesToDisplay = filter(subtitles);

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Text</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {subtitlesToDisplay.map((subtitle, index) => (
                    <TableRow
                        key={index}
                        sx={{
                            backgroundColor: getBackGroundColor(subtitle.startTime, subtitle.endTime, currentTimestamp),
                            cursor: "pointer",
                            "&:hover": {
                                backgroundColor: "lightgray",
                            }
                        }}
                        onClick={() => setPlayerTime(subtitle.startTime)}
                    >
                        <TableCell component="th" scope="row">
                            {formatTime(subtitle.startTime)}
                        </TableCell>
                        <TableCell>{formatTime(subtitle.endTime)}</TableCell>
                        <TableCell>{subtitle.text}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default SubtitleTable;