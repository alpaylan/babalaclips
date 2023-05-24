
import { Table, TableBody, TableCell, TableHead, TableRow} from '@mui/material';
import { SubtitleData } from "@/components/Subtitle";

export type SubtitleTableProps = {
    subtitles: SubtitleData[],
    filter: (subtitles: SubtitleData[]) => SubtitleData[],
    setPlayerTime: (time: number) => void,
    currentTimestamp?: number,
};


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
                {subtitlesToDisplay.map((subtitle, index) => {
                    if (currentTimestamp && currentTimestamp >= subtitle.startTime && currentTimestamp < subtitle.endTime) {
                        return (
                            <TableRow key={index} style={{ backgroundColor: "yellow" }}>
                                <TableCell>{subtitle.startTime}</TableCell>
                                <TableCell>{subtitle.endTime}</TableCell>
                                <TableCell>{subtitle.text}</TableCell>
                            </TableRow>
                        );
                    }
                    return (
                        <TableRow key={index} onClick={() => setPlayerTime(subtitle.startTime)}>
                            <TableCell>{subtitle.startTime}</TableCell>
                            <TableCell>{subtitle.endTime}</TableCell>
                            <TableCell>{subtitle.text}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

export default SubtitleTable;