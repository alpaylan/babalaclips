import { Box, Modal, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React from 'react';

type SubtitleData = {
    startTime: number;
    endTime: number;
    text: string;
};

const getCurrentSubtitle = (subtitles: SubtitleData[], currentTimestamp: number) => {
    // get the subtitle that is currently playing and return its id
    // if no subtitle is playing, return -1
    const res = subtitles.findIndex((subtitle) => {
        if (currentTimestamp >= subtitle.startTime && currentTimestamp <= subtitle.endTime) {
            console.log("currentTimestamp", currentTimestamp);
            console.log("subtitle.startTime", subtitle.startTime);
            console.log("subtitle.endTime", subtitle.endTime);
            return true;
        }
    });
    console.log("res", res);
    return res;
}

const mockSubtitles: SubtitleData[] = [
    {
        startTime: 0,
        endTime: 10,
        text: "Hello"
    },
    {
        startTime: 10,
        endTime: 20,
        text: "World"
    },
    {
        startTime: 20.01,
        endTime: 30,
        text: "!"
    },
    {
        startTime: 30,
        endTime: 40,
        text: "This"
    },
    {
        startTime: 40,
        endTime: 50,
        text: "is"
    },
    {
        startTime: 50,
        endTime: 60,
        text: "a"
    },
    {
        startTime: 60,
        endTime: 70,
        text: "subtitle"
    },
    {
        startTime: 70,
        endTime: 80,
        text: "example"
    },
];

type SubtitleTableProps = {
    subtitles: SubtitleData[],
    currentTimestamp: number,
    setPlayerTime: (time: number) => void,
};
const SubtitleTable = ({ subtitles, currentTimestamp, setPlayerTime }: SubtitleTableProps) => {
    const currentSubtitleId = getCurrentSubtitle(subtitles, currentTimestamp);
    console.log("currentSubtitleId", currentSubtitleId);
    if (currentSubtitleId === -1) {
        return <div>Timestamp is out of bounds</div>;
    }
    let firstSubtitleInTable = currentSubtitleId - 2;
    if (firstSubtitleInTable < 0) {
        firstSubtitleInTable = 0;
    }
    let lastSubtitleInTable = currentSubtitleId + 2;
    if (lastSubtitleInTable > subtitles.length - 1) {
        lastSubtitleInTable = subtitles.length - 1;
    }

    console.log("firstSubtitleInTable", firstSubtitleInTable);
    console.log("lastSubtitleInTable", lastSubtitleInTable);
    const subtitlesToDisplay = subtitles.slice(firstSubtitleInTable, lastSubtitleInTable + 1);
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
                    if (index === (currentSubtitleId - firstSubtitleInTable)) {
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

type SubtitleProps = {
    setPlayerTime: (time: number) => void,
    currentTimestamp: number,
};

const Subtitle = ({ setPlayerTime, currentTimestamp }: SubtitleProps) => {
    const [searchInput, setSearchInput] = React.useState<string>("");
    const [subtitles, setSubtitles] = React.useState<SubtitleData[]>(mockSubtitles);
    return (
        <div>
            <Typography variant="h4" component="h1" gutterBottom>
                Subtitles
            </Typography>
            {// add search bar here
                <TextField
                    id="outlined-basic"
                    label="Search"
                    variant="outlined"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
            }
            <SubtitleTable setPlayerTime={setPlayerTime} subtitles={subtitles} currentTimestamp={currentTimestamp} />
            {
                searchInput === "" ? null : (
                    <div>
                        <Modal
                            open={true}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 400,
                                bgcolor: 'background.paper',
                                border: '2px solid #000',
                                boxShadow: 24,
                                p: 4,
                            }}>
                                <TextField
                                    id="outlined-basic"
                                    label="Search"
                                    variant="outlined"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                                <SubtitleTable setPlayerTime={setPlayerTime} subtitles={subtitles} currentTimestamp={currentTimestamp} />
                            </Box>

                        </Modal>
                    </div>
                )
            }
        </div>
    );
};

export default Subtitle;