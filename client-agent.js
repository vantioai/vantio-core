const VantioLinter = require('vantio-linter');

const secretSalt = 'VANTIO_ZERO_TRUST_SALT_2026';
const linter = new VantioLinter(secretSalt);

// [MODIFIED] Appending a live timestamp to guarantee a unique hash every time
const uniqueRunId = Date.now();
const agentId = 'agent-delta-' + uniqueRunId; 
const intentAction = 'CREATE';
const targetResource = 'gcp_compute_instance';

const vpoiToken = linter.generateVPOI(agentId, intentAction, targetResource);

const agentPayload = {
    agent_id: agentId,
    intent_action: intentAction,
    target_resource: targetResource,
    vpoi_token: vpoiToken,
    payload_data: { instance_type: 'e2-medium', zone: 'us-east1' }
};

console.log('\n[AGENT] Vantio Linter SDK initialized.');
console.log('[AGENT] Minted fresh, unique vPOI token:', vpoiToken);
console.log('[AGENT] Blasting payload at Vantio Firewall (http://localhost:3000)...');

fetch('http://localhost:3000/api/v1/intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agentPayload)
})
.then(res => res.json())
.then(data => console.log('\n[AGENT] Firewall Response:', JSON.stringify(data, null, 2)))
.catch(err => console.error('\n[!] Agent Connection Error:', err));
