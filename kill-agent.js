const { execSync } = require('child_process');
const crypto = require('crypto');

console.log("[VECTOR] Synthesizing Google Identity Skeleton Key for Assassination...");
let idToken;
try {
    idToken = execSync('gcloud auth print-identity-token', { encoding: 'utf-8' }).trim();
} catch (e) {
    console.error("[!] ERROR: Run 'gcloud auth login' to authenticate.");
    process.exit(1);
}

// 1. Establish the Kill Intent
const agentId = 'agent-kill-' + Date.now();
const intentAction = 'DELETE';
const targetResource = 'gcp_compute_instance';

// 2. Generate the precise SHA-256 hash
const secretSalt = 'VANTIO_ZERO_TRUST_SALT_2026';
const payloadStr = agentId + ':' + intentAction + ':' + targetResource + ':' + secretSalt;
const vpoiToken = 'vpoi_' + crypto.createHash('sha256').update(payloadStr).digest('hex');

const agentPayload = {
    agent_id: agentId,
    intent_action: intentAction,
    target_resource: targetResource,
    vpoi_token: vpoiToken,
    payload_data: { 
        instance_name: 'vantio-node-1774103550163', // THE EXACT TARGET
        zone: 'us-central1-a' 
    }
};

const FIREWALL_URL = 'https://vantio-firewall-553375521973.us-central1.run.app/api/v1/intent';

console.log(`[AGENT] Kill Order Minted. Striking target: ${agentPayload.payload_data.instance_name}...`);

fetch(FIREWALL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
    body: JSON.stringify(agentPayload)
})
.then(res => res.status === 403 ? res.text().then(t => {throw new Error(t)}) : res.json())
.then(data => console.log('\n[SUCCESS] Cloud Receipt Received:\n', JSON.stringify(data, null, 2)))
.catch(err => console.error('\n[!] Connection Error:', err.message));