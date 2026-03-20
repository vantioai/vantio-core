const crypto = require('crypto');

// 1. Agent's internal intent
const agentId = 'agent-beta-002';
const intentAction = 'CREATE';
const targetResource = 'gcp_compute_instance';
const secretSalt = 'VANTIO_ZERO_TRUST_SALT_2026'; // The shared cryptographic secret

// 2. Synthesize the mathematically perfect vPOI token (Vantio Linter logic)
const payloadString = agentId + ":" + intentAction + ":" + targetResource + ":" + secretSalt;
const vpoiToken = "vpoi_" + crypto.createHash('sha256').update(payloadString).digest('hex');

const agentPayload = {
    agent_id: agentId,
    intent_action: intentAction,
    target_resource: targetResource,
    vpoi_token: vpoiToken,
    payload_data: { instance_type: 'e2-micro', zone: 'us-east1' }
};

console.log('\n[AGENT] Generated valid vPOI token:', vpoiToken);
console.log('[AGENT] Blasting payload at Vantio Firewall (http://localhost:3000)...');

fetch('http://localhost:3000/api/v1/intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agentPayload)
})
.then(res => res.json())
.then(data => console.log('\n[AGENT] Firewall Response:', JSON.stringify(data, null, 2)))
.catch(err => console.error('\n[!] Agent Connection Error:', err));
