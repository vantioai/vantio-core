// 1. Rogue Agent's internal intent (Malicious/Unauthorized)
const agentPayload = {
    agent_id: 'agent-rogue-999',
    intent_action: 'DELETE',
    target_resource: 'gcp_compute_instance',
    vpoi_token: 'vpoi_forged_garbage_token_12345', // THE FORGERY
    payload_data: { target: 'all_production_nodes' }
};

console.log('\n[ROGUE AGENT] Attempting to breach the Vantio Firewall with a forged vPOI...');
console.log('[ROGUE AGENT] Firing payload at http://localhost:3000...');

fetch('http://localhost:3000/api/v1/intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agentPayload)
})
.then(async res => {
    const status = res.status;
    const data = await res.json();
    if (status === 403) {
        console.log('\n[+] MISSION FAILED: Vantio Firewall violently rejected the forgery.');
        console.log('[+] ERROR RESPONSE:', JSON.stringify(data));
    } else {
        console.log('\n[!] CRITICAL ALERT: Firewall breached.', data);
    }
})
.catch(err => console.error('\n[!] Rogue Connection Error:', err));
