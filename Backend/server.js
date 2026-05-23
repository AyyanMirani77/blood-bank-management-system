const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors());

app.use(express.json());

app.use('/api/auth',         require('./routes/auth'));
app.use('/api/donors',       require('./routes/donors'));
app.use('/api/stock',        require('./routes/bloodStock'));
app.use('/api/hospitals',    require('./routes/hospitals'));
app.use('/api/donations',    require('./routes/donations'));
app.use('/api/requests',     require('./routes/bloodRequests'));
app.use('/api/distribution', require('./routes/distribution'));
app.use('/api/expiry',       require('./routes/expiryLog'));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});