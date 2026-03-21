const express = require('express');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const { InstancesClient } = require('@google-cloud/compute');

const app = express();

// [ABSOLUTE CORS OVERRIDE] - No external npm packages required.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(express.json());

// VANTIO SUPABASE LEDGER CONFIGURATION
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// GCP COMPUTE ENGINE SDK
const instancesClient = new InstancesClient();

// ZERO-TRUST CRYPTOGRAPHIC VALIDATOR
function validateVPOI(agentId, intentAction, targetResource, providedVpoi) {
    const secretSalt = 'VANTIO_ZERO_TRUST_SALT_2026';
    const payloadStr = agentId + ':' + intentAction + ':' + targetResource + ':' + secretSalt;
    const expectedVpoi = 'vpoi_' + crypto.createHash('sha256').update(payloadStr).digest('hex');
    return expectedVpoi === providedVpoi;
}

// [UPGRADED] THE LIVE VANTIO EXECUTION ENGINE
async function executeCloudIntent(intentAction, targetResource, payloadData) {
    console.log('\n[VANTIO EXECUTION ENGINE] Reading intent from Vantio Ledger...');
    const projectId = await instancesClient.getProjectId();
    const zone = payloadData.zone || 'us-central1-a';

    if (intentAction === 'CREATE' && targetResource === 'gcp_compute_instance') {
        console.log('[+] PROVISIONING: Firing LIVE GCP Compute API Request...');
        const machineType = `zones/${zone}/machineTypes/${payloadData.instance_type || 'e2-micro'}`;
        const instanceName = `vantio-node-${Date.now()}`;

        const [response] = await instancesClient.insert({
            instanceResource: {
                name: instanceName,
                machineType: machineType,
                disks: [{ initializeParams: { diskSizeGb: '10', sourceImage: 'projects/debian-cloud/global/images/family/debian-11' }, autoDelete: true, boot: true, type: 'PERSISTENT' }],
                networkInterfaces: [{ name: 'global/networks/default', accessConfigs: [{ type: 'ONE_TO_ONE_NAT', name: 'External NAT' }] }]
            },
            project: projectId, zone: zone,
        });
        return { status: 'Deploying', instance_name: instanceName, gcp_operation: response.name };
    }
    
    if (intentAction === 'DELETE' && targetResource === 'gcp_compute_instance') {
        console.log(`[-] DEPROVISIONING: Firing Teardown for ${payloadData.instance_name}...`);
        try {
            const [response] = await instancesClient.delete({
                instance: payloadData.instance_name, project: projectId, zone: zone,
            });
            return { status: 'Destroying', instance_name: payloadData.instance_name, gcp_operation: response.name };
        } catch (error) {
            return { status: 'Failed', error: error.message };
        }
    }
    
    if (intentAction === 'STRESS_TEST') return { status: 'Logged' };
    return { status: 'Skipped' };
}

// THE FIREWALL GATEWAY
app.post('/api/v1/intent', async (req, res) => {
    console.log(`\n[+] INCOMING AGENT REQUEST INTERCEPTED: ${req.body.agent_id}`);
    const { agent_id, intent_action, target_resource, vpoi_token, payload_data } = req.body;
    
    if (!validateVPOI(agent_id, intent_action, target_resource, vpoi_token)) {
        console.error(`[!] INTRUSION BLOCKED: Invalid cryptographic signature for Agent ${agent_id}`);
        return res.status(403).send('Forbidden: Cryptographic validation failed.');
    }

    console.log('[+] SIGNATURE VERIFIED. Anchoring intent to Supabase Ledger...');
    const { data, error } = await supabase
        .from('vantio_agent_ledger')
        .insert([{ agent_id, intent_action, target_resource, vpoi_token, payload_data }])
        .select();

    if (error) {
        console.error('[!] LEDGER WRITE FAILED:', error.message);
        return res.status(500).json({ error: error.message });
    }

    const executionResult = await executeCloudIntent(intent_action, target_resource, payload_data || {});
    res.status(200).json({ success: true, ledger_receipt: data, execution_receipt: executionResult });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[VANTIO FIREWALL] Edge Node actively intercepting on port ${PORT}`);
});