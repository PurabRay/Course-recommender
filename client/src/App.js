import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  Button,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Link,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import { styled, alpha, createTheme, ThemeProvider } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { motion } from 'framer-motion';

// Styled components
const GlassBox = styled(motion.div)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  color: '#fff',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff',
    transition: 'all 0.3s ease',
    '&:hover, &:focus': {
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
  },
}));

// Theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00f6ff',
    },
    secondary: {
      main: '#9945FF',
    },
    background: {
      default: '#13151a',
      paper: 'rgba(255, 255, 255, 0.03)',
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", sans-serif',
    h1: {
      fontWeight: 700,
    },
    button: {
      fontFamily: '"JetBrains Mono", monospace',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          padding: '10px 20px',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

function ResourceCard({ resource }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassBox>
        <Typography variant="h6" sx={{ 
          background: 'linear-gradient(45deg, #00f6ff, #9945FF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
          mb: 2
        }}>
          {resource.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
          {resource.description}
        </Typography>
        {resource.estimatedTime && (
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 2 }}>
            ⏱️ {resource.estimatedTime}
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="contained"
            component={Link}
            href={resource.url}
            target="_blank"
            sx={{
              background: 'linear-gradient(45deg, #00f6ff, #9945FF)',
              '&:hover': {
                background: 'linear-gradient(45deg, #9945FF, #00f6ff)',
              },
            }}
          >
            Explore
          </Button>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              color: '#00f6ff',
            }}
          >
            {resource.price}
          </Typography>
        </Box>
      </GlassBox>
    </motion.div>
  );
}

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ padding: '20px 0' }}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function App() {
  // States for search subject, resources returned from server, currency info, loading & error status, and tab selection.
  const [subject, setSubject] = useState('');
  const [resources, setResources] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // Handler to trigger resource fetch
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!subject.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/get-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch resources');
      }
      const data = await response.json();
      setResources(data.resources);
      setCurrency(data.currency);
    } catch (err) {
      setError(`Error: ${err.message}. Please try again.`);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const levels = ['beginner', 'intermediate', 'advanced'];

  return (
    <ThemeProvider theme={theme}>
      {/* Amazon-like header */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
          <Toolbar>
            {/* Logo */}
            <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 'bold', color: theme.palette.secondary.main }}>
              Fakezon
            </Typography>
            <GlassBox>
              <SearchInput
                placeholder="Search products…"
                inputProps={{ 'aria-label': 'search' }}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </GlassBox>
            <Button variant="contained" color="secondary" onClick={handleSearch} disabled={loading} sx={{ marginLeft: 2 }}>
              {loading ? <CircularProgress size={20} /> : <SearchIcon />}
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton color="inherit">
                <AccountCircleIcon />
              </IconButton>
              <IconButton color="inherit">
                <ShoppingCartIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <Typography variant="body1" color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        {currency && (
          <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
            Prices shown in {currency.code} ({currency.symbol})
          </Typography>
        )}
        {resources ? (
          <Box>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              centered
              textColor="primary"
              indicatorColor="secondary"
            >
              {levels.map((level) => (
                <Tab key={level} label={level.charAt(0).toUpperCase() + level.slice(1)} />
              ))}
            </Tabs>
            {levels.map((level, index) => (
              <TabPanel value={tabValue} index={index} key={level}>
                <Grid container spacing={2} justifyContent="center">
                  {resources[level] && resources[level].free && resources[level].free.map((resource, idx) => (
                    <Grid item key={idx}>
                      <ResourceCard resource={resource} />
                    </Grid>
                  ))}
                  {resources[level] && resources[level].paid && resources[level].paid.map((resource, idx) => (
                    <Grid item key={idx}>
                      <ResourceCard resource={resource} />
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>
            ))}
          </Box>
        ) : (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Welcome to Fakezon!
            </Typography>
            <Typography variant="body1">
              Enter a subject above and click the search button to explore resources.
            </Typography>
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
