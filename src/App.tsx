import React from "react";
import { Box, Container, ThemeProvider, CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { theme } from "./theme/theme";
import MiniCalendar from "./components/MiniCalendar";
import UpcomingEvents from "./components/UpcomingEvents";
import MainCalendar from "./components/MainCalendar";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ display: "flex", gap: 4 }}>
            {/* Left Sidebar */}
            <Box sx={{ width: 300 }}>
              <MiniCalendar />
              <UpcomingEvents />
            </Box>

            {/* Main Calendar */}
            <Box sx={{ flex: 1 }}>
              <MainCalendar />
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
