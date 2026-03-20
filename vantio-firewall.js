require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Establish secure uplink to the Vantio Ledger
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Cryptographic Engine (Simulating the Vantio Linter logic)
function verifyVPOI(agentId, intentAction, targetResource, providedToken) {
    const secretSalt = "VANTIO_ZERO_TRUST_SALT_2026"; // In production, this lives in .env
    const payload = agentId + ":" + intentAction + ":" + targetResource + ":" + secretSalt;
    const expectedToken = "vpoi_" + crypto.createHash('sha256').update(payload).digest('hex');
    
    return providedToken === expectedToken;
}

// 3. THE VANTIO FIREWALL (Zero-Trust Middleware)
function vantioFirewall(req, res, next) {
    console.log('\n[VANTIO FIREWALL] Intercepting incoming agent payload...');
    const { agent_id, intent_action, target_resource, vpoi_token } = req.body;
    
    const isValid = verifyVPOI(agent_id, intent_action, target_resource, vpoi_token);
    
    if (!isValid) {
        console.error('[!] FIREWALL REJECTION: Cryptographic vPOI mismatch. Payload dropped.');
        return res.status(403).json({ error: 'Unauthorized: Invalid or Missing vPOI Token' });
    }
    
    console.log('[+] FIREWALL ACCEPTANCE: vPOI mathematically validated. Routing to Vantio Ledger...');
    next();
}

// 4. API ENDPOINT: The Gateway
app.post('/api/v1/intent', vantioFirewall, async (req, res) => {
    const { agent_id, intent_action, target_resource, vpoi_token, payload_data } = req.body;
    
    const { data, error } = await supabase
        .from('vantio_agent_ledger')
        .insert([{ agent_id, intent_action, target_resource, vpoi_token, payload_data }])
        .select();

    if (error) {
        console.error('[!] VANTIO LEDGER REJECTION:', error.message);
        return res.status(500).json({ error: 'Ledger anchoring failed' });
    }

    console.log('[+] VANTIO LEDGER ACCEPTANCE: Transaction permanently anchored.');
    res.status(200).json({ success: true, ledger_receipt: data });
});

// 5. Ignite the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('\n[VECTOR] VANTIO FIREWALL ONLINE. Listening on port ' + PORT);
    console.log('[VECTOR] Awaiting inbound agent traffic...');
});
