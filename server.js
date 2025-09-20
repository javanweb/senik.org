
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// API Routers
const sitesRouter = require('./routes/sites');
const usersRouter = require('./routes/users');
const pagesRouter = require('./routes/pages');
const widgetsRouter = require('./routes/widgets');
const contentRouter = require('./routes/content');
const themesRouter = require('./routes/themes'); // Added themes router

// API Routes
app.use('/api/sites', sitesRouter);
app.use('/api/users', usersRouter);
app.use('/api/pages', pagesRouter);
app.use('/api/widgets', widgetsRouter);
app.use('/api/content', contentRouter);
app.use('/api/themes', themesRouter); // Added themes route

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
