
import React from 'react';

import SubtitleTable from '@/components/SubtitleTable';
import { Box, Modal, TextField, Typography } from '@mui/material';

export type SubtitleData = {
    startTime: number;
    endTime: number;
    text: string;
};

type SubtitleProps = {
    setPlayerTime: (time: number) => void,
    currentTimestamp: number,
    data: SubtitleData[],
};

const timestampFilter = (timestamp: number) => (subtitles: SubtitleData[]) => {
    let index = subtitles.findIndex((subtitle) => {
        if (timestamp >= subtitle.startTime && timestamp <= subtitle.endTime) {
            return true;
        }
    });

    if (index === -1) {
        return [];
    }

    let firstSubtitleInTable = (index >= 2) ? index - 2 : 0;
    let lastSubtitleInTable = (index <= subtitles.length - 3) ? index + 2 : subtitles.length - 1;

    return subtitles.slice(firstSubtitleInTable, lastSubtitleInTable + 1);
}

const searchFilter = (searchInput: string) => (subtitles: SubtitleData[]) => {
    return subtitles.filter((subtitle) => {
        return subtitle.text.toLowerCase().includes(searchInput.toLowerCase());
    });
}


const Subtitle = ({ setPlayerTime, currentTimestamp, data }: SubtitleProps) => {
    const [searchInput, setSearchInput] = React.useState<string>("");
    const [subtitles, setSubtitles] = React.useState<SubtitleData[]>(data);
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
            <SubtitleTable 
                setPlayerTime={setPlayerTime} 
                subtitles={subtitles}
                currentTimestamp={currentTimestamp}
                filter={timestampFilter(currentTimestamp)}
                />
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
                                    inputRef={(input) => input && input.focus()}
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                                <SubtitleTable 
                                    setPlayerTime={setPlayerTime} 
                                    subtitles={subtitles} 
                                    filter={searchFilter(searchInput)} />
                            </Box>

                        </Modal>
                    </div>
                )
            }
        </div>
    );
};

export default Subtitle;