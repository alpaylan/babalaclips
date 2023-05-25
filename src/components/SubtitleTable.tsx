
import { Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';
import { SubtitleData } from "@/components/Subtitle";
import subtitles from "@/data/subtitles.json";

export type SubtitleTableProps = {
    filter: (subtitles: SubtitleData[]) => SubtitleData[],
    setPlayerTime: (time: number) => void,
    currentTimestamp?: number,
};

const secondsToTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}


const SubtitleTable = ({ filter, currentTimestamp, setPlayerTime }: SubtitleTableProps) => {
    const subtitlesToDisplay = filter(subtitles);

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Süre</TableCell>
                    <TableCell>Metin</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {subtitlesToDisplay.map((subtitle, index) => {
                    if (currentTimestamp && currentTimestamp >= subtitle.startTime && currentTimestamp < subtitle.endTime) {
                        return (
                            <TableRow key={index} style={{ backgroundColor: "yellow" }}>
                                <TableCell>{secondsToTime(subtitle.startTime)} - {secondsToTime(subtitle.endTime)}</TableCell>
                                <TableCell>{subtitle.text}</TableCell>
                            </TableRow>
                        );
                    }
                    return (
                        <TableRow key={index} onClick={() => setPlayerTime(subtitle.startTime)}>
                            <TableCell>{secondsToTime(subtitle.startTime)} - {secondsToTime(subtitle.endTime)}</TableCell>
                            <TableCell>{subtitle.text}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

export default SubtitleTable;