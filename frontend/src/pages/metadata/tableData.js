import { Box, Card, Checkbox, TextField, Typography, Button, IconButton, Tooltip } from "@mui/material";
import './index.css';
import DeleteIcon from '@mui/icons-material/Delete';

const TableData = ({ metadata, setMetadata }) => {

  const handleAddTable = () => {
    setMetadata((prev) => ({
      ...prev,
      table: [
        ...prev.table,
        { name: '', columns: [{ name: '', distinct: '', index: false, height: '', max: '', min: '' }] }
      ]
    }));
  };

  const handleAddColumn = (tableIndex) => {
    setMetadata((prev) => {
      const updated = { ...prev };
      console.log(updated);
      updated.table[tableIndex].columns.push({ name: '', distinct: '', index: false, height: '', max: '', min: '' });
      return updated;
    });
  }

  const handleColumnChange = (value, property, tableIndex, columnIndex) => {
    const updated = { ...metadata };
    updated.table[tableIndex].columns[columnIndex][property] = value;
    setMetadata(updated);
  }

  const handleTableName = (tableIndex, value) => {
    const updated = { ...metadata };
    updated.table[tableIndex].name = value;
    setMetadata(updated);
  }

  const handleNr = (tableIndex, value) => {
    const updated = {...metadata};
    updated.table[tableIndex].nr = value;
    setMetadata(updated);
  }

  const handleColumnDelete = (colIdx, tableIdx) => {
    const updated = {...metadata}
    updated.table[tableIdx].columns.splice(colIdx, 1)
    setMetadata(updated);
  }

  const handleTableDelete = (tableIdx) => {
    const updated = {...metadata};
    updated.table.splice(tableIdx, 1);
    setMetadata(updated);
  }

  const handleBlockingFactor = (value) => {
    const updated = {...metadata};
    updated.blockingFactor = value || 0;
    setMetadata(updated);
  }

  return (
    <>
      <Card sx={{ margin: '1em' }}>
        <TextField type="number" label="Blocking Factor" onChange={(e) => handleBlockingFactor(e.target.value)}/>
      </Card>
      {
        metadata?.table.map((table, tableIdx) => {
          return (
            <div key={tableIdx} className="outer-div">
              <Card className="table-card">
                <Box className="table-data">
                  <Typography variant="h6">Table Data</Typography>
                  <TextField id="table-name" label="Table Name" variant="outlined" onChange={(e) => handleTableName(tableIdx, e.target.value)} />
                  <TextField id="total-rows" label="Total no. of rows (Nr)" type='number' onChange={(e) => handleNr(tableIdx, e.target.value)} />
                </Box>

                <Box sx={{ height: 'fit-content' }}>

                  {table?.columns.map((col, colIdx) => {
                    return (
                      <Box key={colIdx} className="column-data">
                        <TextField size="small" label="Column Name" type='text' value={col.name} onChange={(e) => handleColumnChange(e.target.value, 'name', tableIdx, colIdx)} />
                        <TextField size="small" label="Total no. of Distinct Values - V" type="number" value={col.distinct} onChange={(e) => handleColumnChange(e.target.value, 'distinct', tableIdx, colIdx)} />
                        <TextField size="small" label="Maximum value" type="number" value={col.max} onChange={(e) => { handleColumnChange(e.target.value, 'max', tableIdx, colIdx) }} />
                        <TextField size="small" label="Minimum Value" type="number" value={col.min} onChange={(e) => { handleColumnChange(e.target.value, 'min', tableIdx, colIdx) }} />
                        <Box sx={{ display: 'flex', alignItems: 'center ', justifyContent: 'center' }}>
                          <Typography variant="subtitle2">Index</Typography>
                          <Checkbox onChange={(e) => handleColumnChange(!col.index, 'index', tableIdx, colIdx)} />
                          {col.index && (
                            <TextField size="small" label="Height of Index Tree" type="number" value={col.height} onChange={(e) => { handleColumnChange(e.target.value, 'height', tableIdx, colIdx) }} />
                          )}
                        </Box>
                        <Tooltip title="Delete column">
                          <IconButton onClick={() => handleColumnDelete(colIdx, tableIdx)}> <DeleteIcon /> </IconButton>
                        </Tooltip>
                      </Box>
                    )
                  })
                  }
                  <Button variant="contained" onClick={() => handleAddColumn(tableIdx)} >Add Column</Button>
                </Box >
              </Card>
              <Tooltip title="Delete table">
                <IconButton className="delete-table-button" onClick={() => handleTableDelete(tableIdx)}><DeleteIcon sx={{ color: "red" }} /></IconButton>
              </Tooltip>
            </div>
          )
        })
      }
      <Button variant="contained" onClick={() => handleAddTable()}>Add New Table</Button>
    </>
  )
}

export default TableData