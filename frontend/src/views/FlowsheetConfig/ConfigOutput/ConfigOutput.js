import React from 'react';
import {useParams} from "react-router-dom";
import { Grid, Box, Alert } from '@mui/material';
import {
    downloadSweepResults,
    downloadSingleOutput,
    saveConfig
} from '../../../services/output.service.js';
// Components for sweep or single-run output, respectively
import SweepOutput from "../../../components/SweepOutput/SweepOutput";
import SingleOutput from "../../../components/SingleOutput/SingleOutput";


export default function ConfigOutput(props) {
    let params = useParams();
    const {flowsheetData, isSweep, inputsChanged} = props;

    // Use a temporary hyperlink to download sweep output
    const downloadSweepOutput = () => {
        downloadSweepResults(params.id)
            .then(response => response.blob())
            .then((data) => {
                const href = window.URL.createObjectURL(data);
                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', 'sweep_results.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    }

    // Return either sweep or single-output version
    return (
        <Box>
            {inputsChanged ?
                <Alert id = 'inputChangeFlag' color="warning" severity='warning' sx={{ mb: '2rem' }}>
                    Inputs changed since last run
                </Alert> : <></>}
            <Grid container spacing={2} alignItems="flex-start">
                {isSweep ?
                    <SweepOutput
                        sweep_results={flowsheetData.outputData.sweep_results}
                        output_exports={flowsheetData.outputData.exports}
                        downloadOutput={downloadSweepOutput} 
                    />
                    :
                    <SingleOutput flowsheetData={flowsheetData}
                        downloadOutput={downloadSingleOutput}
                        saveConfig={saveConfig} />
                }
            </Grid>
        </Box>
    );
}
