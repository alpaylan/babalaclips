

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents, TableVirtuosoHandle } from 'react-virtuoso';
import { SubtitleData } from './Subtitle';

import subtitles from '@/data/subtitles.json';
import { Button, Typography } from '@mui/material';
import { useRef } from 'react';
import SaveIcon from '@mui/icons-material/Save';

const columns = [
    {
        dataKey: 'time',
        label: 'Süre',
        width: 10,
    },
    {
        dataKey: 'text',
        label: 'Metin',
        width: 100,
    },
];

const VirtuosoTableComponents: TableComponents<SubtitleData> = {
    // eslint-disable-next-line react/display-name
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
        <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
        <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
    // eslint-disable-next-line react/display-name
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableBody {...props} ref={ref} />
    )),
};

function fixedHeaderContent() {
    return (
        <TableRow>
            {columns.map((column) => (
                <TableCell
                    key={column.dataKey}
                    variant="head"
                    style={{ width: column.width }}
                    sx={{
                        backgroundColor: 'background.paper',
                    }}
                >
                    {column.label}
                </TableCell>
            ))}
        </TableRow>
    );
}

const secondsToTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
}

// eslint-disable-next-line react/display-name
const rowContent = (startId: number, endId: number) => (_index: number, row: SubtitleData) => {
    let style = undefined;

    if (_index >= startId && _index <= endId) {
        style = { backgroundColor: "yellow" };
    }

    return (
        <>
            <TableCell style={style}>{secondsToTime(row.startTime)} - {secondsToTime(row.endTime)}</TableCell>
            <TableCell style={style}>{row.text}</TableCell>
        </>
    );
}

export interface CutterTableProps {
    interval: [number, number];
}


const CutterTable: React.FC<CutterTableProps> = ({ interval }) => {
    const virtuoso = useRef<TableVirtuosoHandle>(null);

    async function handleSave() {
        const data = {
            start: interval[0],
            end: interval[1]
        };
    
        const endpointResponse = await fetch('https://babalaclips.fly.dev/cut', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            mode: 'cors'
        });
    
        const cutResponse = await fetch(await endpointResponse.text(), {
            method: 'GET',
            mode: 'cors'
        });
        const cutBlob = await cutResponse.blob();
        
        try {
            console.log(cutBlob);
            const urlObject = URL.createObjectURL(cutBlob);
            const link = document.createElement('a');
            link.href = urlObject;
            link.download = "babalaclip.mp4";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(urlObject)
        } catch(error)  {
            console.error('Error:', error);
            alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        };
    };

    return (
        <Paper style={{ height: 400, width: '100%' }}>
            <TableVirtuoso
                data={subtitles}
                ref={virtuoso}
                components={VirtuosoTableComponents}
                fixedHeaderContent={fixedHeaderContent}
                itemContent={rowContent(interval[0], interval[1])}
            />
            <Typography
                variant="h6"
                component="div"
                sx={{ display: 'flex', height: '10vh' }}
            >
                Aralık: {secondsToTime(subtitles[interval[0]].startTime)} - {secondsToTime(subtitles[interval[1]].endTime)}
            </Typography>
            <Button
                variant="outlined"
                disabled={subtitles[interval[1]].endTime - subtitles[interval[0]].startTime > 180}
                style={{ justifyContent: "left" }} startIcon={<SaveIcon />}
                onClick={handleSave}>
                Kaydet
            </Button>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                    virtuoso.current?.scrollToIndex({ index: interval[0], align: 'start' });
                }}
            >  Aralığa Git</Button>
        </Paper>
    );
};


export default CutterTable;