import {
    Box,
    IconButton,
    Paper,
    Stack,
    Typography,
    useTheme,
  } from "@mui/material";
import Pie from "./pie";
import Pie2 from "./pie2";
  
  const Row2 = () => {
    const theme = useTheme();
    return (
      <Stack direction={"row"} flexWrap={"wrap"} gap={1.2} mt={1.3}>
        <Paper sx={{ minWidth: 400, maxWidth:687, flexGrow:1, maxHeight: 350}}>
          <Stack
            alignItems={"center"}
            direction={"row"}
            flexWrap={"wrap"}
            justifyContent={"space-between"}
          >
            <Box sx={{
            overflow: "auto",
            borderRadius: "4px",
            mawWidth: "300px",
            minHeight: 455,
            flexGrow: 1,
          }}>
            <Typography
              color={theme.palette.secondary.main}
              fontWeight={"bold"}
              p={1.2}
              variant="h6"
            >
                Techniciens par departement
              </Typography>
              <Pie2 />
            </Box>
          </Stack>
  
        </Paper>
  
        <Box
          sx={{
            overflow: "auto",
            borderRadius: "4px",
            minWidth: "500px",
            minHeight: 455,
            flexGrow: 1,
          }}
        >
          <Paper  sx={{ maxWidth: 687, flexGrow: 1, minWidth: "400px" , maxHeight: 350}}>
            <Typography
              color={theme.palette.secondary.main}
              fontWeight={"bold"}
              p={1.2}
              variant="h6"
            >
              Demandeurs par client
            </Typography>
            <Pie  />
          </Paper>
        </Box>
      </Stack>
    );
  };
  
  export default Row2;
  