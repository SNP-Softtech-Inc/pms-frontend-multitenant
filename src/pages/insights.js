
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';


export default function RowAndColumnSpacing() {
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            <Paper> 1</Paper>
           
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
         <Box>
          <Paper> 2</Paper>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
         <Box>
<Paper> 3</Paper>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
         <Paper> 4</Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
