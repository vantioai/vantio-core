const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// 1. Host the Vantio Ledger (Main UI)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// [M&A VANTIO ROUTE] - Host the Public Front Door (Landing Page)
app.get('/landing', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing.html'));
});

// 2. The Server-to-Server Proxy (Bypasses all browser CORS limitations)
app.post('/proxy/intent', async (req, res) => {
    const { payload, token } = req.body;
    const FIREWALL_URL = 'https://vantio-firewall-553375521973.us-central1.run.app/api/v1/intent';
    
    try {
        // Node.js doesn't have CORS preflights. It just attacks the firewall directly.
        const response = await fetch(FIREWALL_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Re-attaching the Google key here
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: errorText });
        }
        
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// [UPGRADED]: Dynamic port allocation for Google Cloud Run / Render compatibility
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`\n[+] VANTIO FIREWALL ACTIVE: Edge Gateway listening on port ${PORT}\n`);
});