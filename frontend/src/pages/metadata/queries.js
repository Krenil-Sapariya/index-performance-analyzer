import { Box, Card, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import "./queries.css"

const Queries = ({ metadata, setMetadata }) => {

  const handleQueryChange = (e) => {
    const updated = { ...metadata };
    updated.queries = e.target.value.split(',')
    setMetadata(updated);
    console.log(metadata.queries);
  }

  return (
    <Box className="query-box">
      <Card className="query-card">
        <Typography className="query-header" variant="h6">List of Queries</Typography>
        <TextField
          className="query-textarea"
          label="Enter Queries Here"
          placeholder="Comma Seperated Queries"
          multiline
        />
        <Tooltip title="Save Queries">
          <IconButton className="query-save-btn" color="primary"><SaveIcon /></IconButton>
        </Tooltip>
      </Card>
    </Box>
  )
}

export default Queries