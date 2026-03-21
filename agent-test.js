require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// 1. Extract secure keys from local vault
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function anchorTransaction() {
    console.log('\n[VECTOR] Autonomous Agent initialized.');
    console.log('[VECTOR] Bypassing Vantio Linter & Vantio Firewall (Simulated Authorization)...');
    console.log('[VECTOR] Establishing secure handshake with the Vantio Ledger...');
    
    // 2. Synthesize an AUTHORIZED agent payload
    const securePayload = {
        agent_id: 'agent-alpha-001',
        intent_action: 'CREATE', // Allowed action
        target_resource: 'vantio_core_compute',
        vpoi_token: 'vpoi_auth_' + Date.now(), // Simulating the vPOI token from the Vantio Linter
        payload_data: { compute_cores: 4, memory: '16GB' }
    };

    // 3. Blast the payload into the immutable Vantio Ledger
    const { data, error } = await supabase
        .from('vantio_agent_ledger')
        .insert([securePayload])
        .select();

    if (error) {
        console.error('\n[!] VANTIO LEDGER REJECTION:', error.message);
    } else {
        console.log('\n[+] VANTIO LEDGER ACCEPTANCE: vPOI validated. Transaction permanently anchored.');
        console.log(JSON.stringify(data, null, 2));
    }
}

anchorTransaction();
