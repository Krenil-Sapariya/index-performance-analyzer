import { Box, FormControl } from "@mui/material";
import TableData from "./tableData";
import Queries from "./queries";
import { useState } from "react";

const Metadata = () => {

    const [metadata, setMetadata] = useState({
        table: [{ name: '', columns: [{ name: '', distinct: '', index: false, height: '', max: '', min: '' }] }],
    });

    return (
        <Box sx={{ width: 'inherit', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <FormControl sx={{ width: 'inherit' }}>
                <TableData metadata={metadata} setMetadata={setMetadata} />
                <Queries />
            </FormControl>
        </Box>
    )
}

export default Metadata;