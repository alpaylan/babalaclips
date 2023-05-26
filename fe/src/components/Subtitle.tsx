
import React from 'react';

import SubtitleTable from '@/components/SubtitleTable';
import { Box, Tab, Tabs, TextField} from '@mui/material';
import Cutter from './Cutter';

import subtitles from '@/data/subtitles.json';

export type SubtitleData = {
  startTime: number;
  endTime: number;
  text: string;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

type SubtitleProps = {
  setPlayerTime: (time: number) => void,
  currentTimestamp: number,
  data: SubtitleData[],
};

const timestampHighlight = (timestamp: number) => (subtitle: SubtitleData) => {
  return (timestamp >= subtitle.startTime && timestamp < subtitle.endTime)
}

const timeStampToSubtitle = (timestamp: number) => {
  return subtitles.findIndex((subtitle) => {
    return (timestamp >= subtitle.startTime && timestamp < subtitle.endTime)
  });
}

const searchFilter = (searchInput: string) => (subtitles: SubtitleData[]) => {
  return subtitles.filter((subtitle) => {
    return subtitle.text.toLowerCase().includes(searchInput.toLowerCase());
  });
}

const Subtitle = ({ setPlayerTime, currentTimestamp }: SubtitleProps) => {
  const [searchInput, setSearchInput] = React.useState<string>("");
  const [tabValue, setTabValue] = React.useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Altyazılar" {...a11yProps(0)} />
          <Tab label="Arama" {...a11yProps(1)} />
          <Tab label="Kesme" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div style={{ height: "600px", overflow: "auto" }}>
          <SubtitleTable
            setPlayerTime={setPlayerTime}
            currentTimestamp={currentTimestamp}
            scrollSelected={true}
            highlight={timestampHighlight(currentTimestamp)}
          />
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{ m: 1 }}
        />
        <div style={{ height: "530px", overflow: "auto" }}>
          <SubtitleTable
            scrollSelected
            setPlayerTime={setPlayerTime}
            filter={searchFilter(searchInput)}
          />
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <div style={{ height: "650px", overflow: "auto" }}>
          <Cutter 
            initialSubtitleId={timeStampToSubtitle(currentTimestamp)} 
            timestamp={currentTimestamp}
            />
        </div>
      </TabPanel>
    </Box>
  );
};

export default Subtitle;