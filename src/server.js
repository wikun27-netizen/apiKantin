import dotenv from 'dotenv';
import app from './app.js';
import { warmUpFCM } from './util/sendFCM.js';

dotenv.config();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  warmUpFCM();
});
