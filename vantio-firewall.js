require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function verifyVPOI(agentId, intentAction, targetResource, providedToken) {
    const secretSalt = 'VANTIO_ZERO_TRUST_SALT_2026'; 
    const payload = agentId + ':' + intentAction + ':' + targetResource + ':' + secretSalt;
    const expectedToken = 'vpoi_' + crypto.createHash('sha256').update(payload).digest('hex');
    return providedToken === expectedToken;
}

// [NEW] THE VANTIO EXECUTION ENGINE
async function executeCloudIntent(intentAction, targetResource, payloadData) {
    console.log('\n[VANTIO EXECUTION ENGINE] Reading intent from Vantio Ledger...');
    
    if (intentAction === 'CREATE' && targetResource === 'gcp_compute_instance') {
        console.log('[+] PROVISIONING: Firing GCP API Request...');
        console.log('[+] ALLOCATING: ' + payloadData.instance_type + ' in zone ' + payloadData.zone);
        
        // Simulating the 2-second network delay of hitting Google Cloud's API
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockIp = '34.118.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255);
        console.log('[+] GCP SUCCESS: Compute Instance online. External IP assigned: ' + mockIp);
        return { status: 'Success', ip: mockIp };
    }
    
    console.log('[-] EXECUTION ENGINE: Intent not supported. No infrastructure built.');
    return { status: 'Skipped' };
}

function vantioFirewall(req, res, next) {
    console.log('\n[VANTIO FIREWALL] Intercepting incoming agent payload...');
    const { agent_id, intent_action, target_resource, vpoi_token } = req.body;
    
    if (!verifyVPOI(agent_id, intent_action, target_resource, vpoi_token)) {
        console.error('[!] FIREWALL REJECTION: Cryptographic vPOI mismatch. Payload dropped.');
        return res.status(403).json({ error: 'Unauthorized: Invalid vPOI' });
    }
    
    console.log('[+] FIREWALL ACCEPTANCE: vPOI validated. Routing to Vantio Ledger...');
    next();
}

app.post('/api/v1/intent', vantioFirewall, async (req, res) => {
    const { agent_id, intent_action, target_resource, vpoi_token, payload_data } = req.body;
    
    // 1. Anchor to Ledger
    const { data, error } = await supabase
        .from('vantio_agent_ledger')
        .insert([{ agent_id, intent_action, target_resource, vpoi_token, payload_data }])
        .select();

    if (error) {
        console.error('[!] VANTIO LEDGER REJECTION:', error.message);
        return res.status(500).json({ error: 'Ledger anchoring failed' });
    }
    console.log('[+] VANTIO LEDGER ACCEPTANCE: Transaction permanently anchored.');

    // 2. Trigger Cloud Execution
    const executionResult = await executeCloudIntent(intent_action, target_resource, payload_data);

    // 3. Return final receipt to the Agent
    res.status(200).json({ 
        success: true, 
        ledger_receipt: data,
        execution_receipt: executionResult
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('\n[VECTOR] VANTIO FIREWALL & EXECUTION ENGINE ONLINE. Port ' + PORT);
});
