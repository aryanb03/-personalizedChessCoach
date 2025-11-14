import { useState, useEffect } from 'react';
import './App.css';
import '@fontsource/medievalsharp';
import { Drawer, List, ListItem, ListItemText, Box, Typography, Divider, CssBaseline, AppBar, Toolbar, IconButton, Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MenuIcon from '@mui/icons-material/Menu';
import Board from './components/Board';
import LiveLichessGames from './components/LiveLichessGames';
import OpeningAnalysis from './components/OpeningAnalysis';
import ChessCoachAI from './components/ChessCoachAI';

const sections = [
  { key: 'overview', label: 'Overview', icon: <DashboardIcon /> },
  { key: 'openings', label: 'Openings', icon: <BarChartIcon /> },
  { key: 'stats', label: 'Statistics', icon: <BarChartIcon /> },
  { key: 'board', label: 'Board', icon: <SportsEsportsIcon /> },
  { key: 'chatbot', label: 'Chatbot', icon: <ChatBubbleIcon /> },
];

const darkFantasyTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0a0f1a',
      paper: 'rgba(34, 24, 48, 0.95)',
    },
    primary: {
      main: '#4b2e83',
    },
    text: {
      primary: '#e0d6f6',
      secondary: '#b39ddb',
    },
  },
  typography: {
    fontFamily: 'MedievalSharp, serif',
  },
});

function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [username, setUsername] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [inputError, setInputError] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [coachGames, setCoachGames] = useState([]);
  const [coachGamesLoaded, setCoachGamesLoaded] = useState(false);

  const handleProfileMenuOpen = (event) => setProfileMenuAnchor(event.currentTarget);
  const handleProfileMenuClose = () => setProfileMenuAnchor(null);

  // Auto-fetch games for coach when chatbot section is opened
  const fetchCoachGames = async () => {
    if (coachGamesLoaded) return; // Don't fetch again if already loaded
    
    try {
      const res = await fetch(`http://localhost:3001/api/lichess/games/dreadlordpawn3`);
      if (res.ok) {
        const data = await res.json();
        if (data.games && data.games.length > 0) {
          setCoachGames(data.games);
          setCoachGamesLoaded(true);
        }
      }
    } catch (error) {
      console.error('Error fetching coach games:', error);
    }
  };

  // Fetch coach games when chatbot section is selected
  useEffect(() => {
    if (activeSection === 'chatbot' && !coachGamesLoaded) {
      fetchCoachGames();
    }
  }, [activeSection, coachGamesLoaded]);

  const fetchGames = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGames([]);
    setSelectedGame(null);
    setInputError(false);
    try {
      const res = await fetch(`http://localhost:3001/api/lichess/games/${username}`);
      if (!res.ok) {
        setError('Failed to fetch games. Please check the username or try again later.');
        setInputError(true);
        return;
      }
      const data = await res.json();
      if (data.games && data.games.length > 0) {
        setGames(data.games);
      } else {
        setError('No games found for this username.');
        setInputError(true);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setInputError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkFantasyTheme}>
      <CssBaseline />
      {/* Top Bar */}
      <AppBar position="fixed" sx={{ zIndex: 1300, background: 'rgba(10,15,26,0.98)', boxShadow: '0 0 24px 2px #00eaff33' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MenuIcon sx={{ color: '#00eaff', fontSize: 32, mr: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 2, color: '#00eaff', textShadow: '0 0 12px #00eaff99' }}>
              Aryan's ChessMindAI
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Profile">
              <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: '#00eaff', color: '#18141a', fontWeight: 'bold' }}>A</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileMenuClose}
              PaperProps={{ sx: { background: '#18141a', color: '#e0d6f6', minWidth: 180 } }}
            >
              <MenuItem onClick={handleProfileMenuClose}>Profile (coming soon)</MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', pt: 8, minHeight: '100vh', background: 'transparent' }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: 220,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 220, boxSizing: 'border-box', background: '#222', color: '#fff', pt: 10, borderRight: '2px solid #00eaff', boxShadow: '0 0 24px 4px #00eaffcc' },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: '#00eaff', color: '#18141a', fontWeight: 'bold', width: 56, height: 56, mb: 1 }}>A</Avatar>
            <Typography variant="body1" sx={{ color: '#e0d6f6', fontWeight: 'bold', letterSpacing: 1 }}>Aryan</Typography>
          </Box>
          <Divider sx={{ bgcolor: '#444' }} />
          <List>
            {sections.map((section) => (
              <ListItem
                button
                key={section.key}
                selected={activeSection === section.key}
                onClick={() => setActiveSection(section.key)}
                sx={{
                  '&.Mui-selected': {
                    background: 'linear-gradient(90deg, #00eaff22 0%, #2a1d3a 100%)',
                    boxShadow: '0 0 16px 4px #00eaffcc',
                    animation: activeSection === section.key ? 'glow 1.5s infinite alternate' : 'none',
                  },
                  display: 'flex', alignItems: 'center', gap: 2, pl: 2,
                  '@keyframes glow': {
                    from: { boxShadow: '0 0 16px 4px #00eaffcc' },
                    to: { boxShadow: '0 0 32px 8px #e0d6f6cc' },
                  },
                }}
              >
                {section.icon}
                <ListItemText primary={section.label} sx={{ ml: 2 }} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        {/* Main Content Area */}
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', background: 'transparent', minHeight: '100vh', p: 4 }}>
          <Box sx={{ width: '100%', maxWidth: 1100, mx: 'auto' }}>
            {activeSection === 'overview' && (
              <Box className="card-section" sx={{ mb: 4 }}>
                <Typography variant="h2" gutterBottom>Welcome to Aryan's ChessMindAI</Typography>
                <Typography className="section-desc">
                  Enter your Lichess username to analyze your games, explore your playstyle, and get futuristic chess insights.
                </Typography>
                {/* Show opening analysis if no user games loaded */}
                {games.length === 0 && <OpeningAnalysis />}
                <form onSubmit={fetchGames} style={{ marginBottom: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Enter Lichess username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    className={inputError ? 'shake' : ''}
                    onAnimationEnd={() => setInputError(false)}
                  />
                  <button type="submit" disabled={loading} style={{ marginLeft: 10 }}>
                    {loading ? 'Loading...' : 'Fetch Games'}
                  </button>
                </form>
                {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
                {games.length > 0 && (
                  <Box className="card-section" sx={{ background: 'rgba(0, 234, 255, 0.07)', borderColor: '#00eaff', mt: 3 }}>
                    <Typography variant="h3">Recent Games</Typography>
                    <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', padding: 0, listStyle: 'none' }}>
                      {games.map((game, idx) => (
                        <li key={idx} style={{ marginBottom: 8 }}>
                          <button onClick={() => setSelectedGame(game)}>
                            {game.players?.white?.user?.name || 'White'} vs {game.players?.black?.user?.name || 'Black'}
                            {game.opening ? ` | Opening: ${game.opening.name}` : ''}
                            {game.createdAt ? ` | ${new Date(game.createdAt).toLocaleString()}` : ''}
                          </button>
                        </li>
                      ))}
                    </ul>
                    {selectedGame && (
                      <Box sx={{ marginTop: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h3">Selected Game</Typography>
                        <Board pgn={selectedGame.pgn} />
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            )}
            {activeSection === 'openings' && (
              <Box className="card-section">
                <Typography variant="h2" gutterBottom>Most Played Openings</Typography>
                <Typography className="section-desc">Coming soon: Opening stats and charts!</Typography>
              </Box>
            )}
            {activeSection === 'stats' && (
              <Box className="card-section">
                <Typography variant="h2" gutterBottom>Statistics</Typography>
                <Typography className="section-desc">Coming soon: Performance, blunders, streaks, and more!</Typography>
              </Box>
            )}
            {activeSection === 'board' && (
              <Box className="card-section">
                <Typography variant="h2" gutterBottom>Interactive Board</Typography>
                <Typography className="section-desc">Coming soon: Play through games, engine analysis, and opening explorer!</Typography>
              </Box>
            )}
            {activeSection === 'chatbot' && (
              <Box className="card-section">
                <Typography variant="h2" gutterBottom sx={{ color: '#00eaff', textShadow: '0 0 12px #00eaff99' }}>
                  Aryan - Your Chess Coach
                </Typography>
                <Typography className="section-desc" sx={{ mb: 3 }}>
                  Your personal chess mentor and strategic advisor
                </Typography>
                <ChessCoachAI userGames={coachGames} userStats={null} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
