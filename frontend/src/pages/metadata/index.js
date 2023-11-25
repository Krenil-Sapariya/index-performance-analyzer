import { Box, Button, FormControl } from "@mui/material";
import TableData from "./tableData";
import Queries from "./queries";
import { useState } from "react";

const Metadata = ({handleSubmit}) => {

    const [metadata, setMetadata] = useState({
        blockingFactor: 0,
        table: [{ name: '', nr: '', columns: [{ name: '', distinct: '', index: false, height: '', max: '', min: '' }] }],
        queries: []
    });

    const onSubmit = () => {
        handleSubmit(metadata);
    }

    return (
        <Box sx={{ width: 'inherit', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FormControl sx={{ width: 'inherit' }}>
                <TableData metadata={metadata} setMetadata={setMetadata} />
                <Queries metadata={metadata} setMetadata={setMetadata} />
                <Button type="submit" variant="contained" sx={{width: 'fit-content'}} onClick={() => onSubmit()}>Analyze</Button>
            </FormControl>
        </Box>
    )
}

export default Metadata;