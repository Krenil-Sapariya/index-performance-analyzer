import { Box, Card, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import "./queries.css"

const Queries = ({ metadata, setMetadata }) => {

  const handleQueryChange = (queryString) => {
    const updated = {...metadata};
    updated.queries = queryString.split(',').map((query) => query.trim());
    setMetadata(updated);
  }

  console.log(metadata.queries);

  return (
    <Box className="query-box">
      <Card className="query-card">
        <Typography className="query-header" variant="h6">List of Queries</Typography>
        <TextField
          onChange={(e) =>  handleQueryChange(e.target.value)}
          className="query-textarea"
          label="Enter Queries Here"
          placeholder="Comma Seperated Queries"
          multiline
        />
      </Card>
    </Box>
  )
}

export default Queries