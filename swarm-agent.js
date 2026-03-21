const { execSync } = require('child_process');
const crypto = require('crypto');

console.log("[VECTOR] Synthesizing Google Identity Skeleton Key for the Swarm...");
let idToken;
try {
    idToken = execSync('gcloud auth print-identity-token', { encoding: 'utf-8' }).trim();
} catch (e) {
    console.error("[!] ERROR: Run 'gcloud auth login' to authenticate.");
    process.exit(1);
}

const FIREWALL_URL = 'https://vantio-firewall-553375521973.us-central1.run.app/api/v1/intent';
const secretSalt = 'VANTIO_ZERO_TRUST_SALT_2026';
const SWARM_SIZE = 10;

async function unleashSwarm() {
    console.log(`[SWARM] Unleashing ${SWARM_SIZE} concurrent autonomous agents...`);
    
    const swarmPromises = [];

    for (let i = 1; i <= SWARM_SIZE; i++) {
        // 1. Establish Unique Intent for each Agent
        const agentId = `agent-swarm-node-${i}-${Date.now()}`;
        const intentAction = 'STRESS_TEST';
        const targetResource = 'vantio_firewall_node';

        // 2. Generate the precise SHA-256 hash
        const payloadStr = agentId + ':' + intentAction + ':' + targetResource + ':' + secretSalt;
        const vpoiToken = 'vpoi_' + crypto.createHash('sha256').update(payloadStr).digest('hex');

        const agentPayload = {
            agent_id: agentId,
            intent_action: intentAction,
            target_resource: targetResource,
            vpoi_token: vpoiToken,
            payload_data: { test_id: i, load: 'maximum' }
        };

        // 3. Queue the request
        const request = fetch(FIREWALL_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}` 
            },
            body: JSON.stringify(agentPayload)
        }).then(res => res.json());

        swarmPromises.push(request);
    }

    // FIRE ALL WEAPONS SIMULTANEOUSLY
    const results = await Promise.all(swarmPromises);
    console.log(`\n[SUCCESS] Swarm attack complete. ${results.length} receipts returned from Cloud Edge.`);
}

unleashSwarm();