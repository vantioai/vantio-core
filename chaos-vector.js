// [VANTIO: SYNTHETIC CHAOS VECTOR - ALPHA COHORT]
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const crypto = require('crypto');

// Target Coordinates
const SUPABASE_URL = 'https://vsfwnebykwyarirhrzjl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_RNS0fZ4nWZW8TuJOQ7-1VA_aOSPE-W2';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function executeChaosVector() {
    console.log('\n===========================================================');
    console.log(' VANTIO ENTERPRISE CONTROL PLANE // ALPHA COHORT');
    console.log('===========================================================\n');

    await sleep(500);
    process.stdout.write('[-] Authenticating Skeleton Key... ');

    // STEP 1: The Cryptographic Lock (Reading the .env file)
    let skeletonKey = '';
    try {
        const envFile = fs.readFileSync('.env', 'utf8');
        const match = envFile.match(/VANTIO_SKELETON_KEY=(vpoi_sk_[A-Za-z0-9]+)/);
        if (!match) throw new Error('Invalid Key');
        skeletonKey = match[1];
        console.log('[\x1b[32mVERIFIED\x1b[0m]');
    } catch (e) {
        console.log('[\x1b[31mREJECTED\x1b[0m]');
        console.log('\n[!] FATAL ERROR: Clearance denied. VANTIO_SKELETON_KEY missing or invalid in .env file.\n');
        process.exit(1);
    }

    await sleep(800);
    console.log('\n[!] WARNING: UNAUTHORIZED SYNTHETIC AGENT INITIALIZED');
    console.log('[!] TARGETING SANDBOX INFRASTRUCTURE...\n');

    await sleep(1000);
    // STEP 2: The Catastrophic Drop
    console.log('[-] EXECUTING CATASTROPHIC DATABASE WIPE...');
    const { error: dropError } = await supabase
        .from('vantio_sandbox_state')
        .delete()
        .neq('resource_id', 'null'); // Deletes all rows

    if (dropError) {
        console.log('[!] CHAOS FAILED:', dropError.message);
        return;
    }
    console.log('    -> CRITICAL DATA PURGED. SANDBOX COMPROMISED.');

    await sleep(1000);
    // STEP 3: The Mockery Log (Logging the destruction using THEIR key)
    console.log('[-] INJECTING TAUNT INTO VANTIO LEDGER...');
    const { error: logError } = await supabase
        .from('vantio_agent_ledger')
        .insert([{
            agent_id: `alpha-operator-${skeletonKey.substring(8, 14)}`,
            intent_action: 'CATASTROPHIC_OVERRIDE',
            target_resource: 'vantio_sandbox_state',
            vpoi_token: skeletonKey, // We use their exact key as the token!
            payload_data: { "status": "DESTROYED", "error_code": "0xDEADBEEF" }
        }]);

    if (logError) {
        console.log('[!] LEDGER INJECTION FAILED:', logError.message);
    } else {
        console.log('    -> LEDGER UPDATED WITH ROGUE ANCHOR.');
    }

    await sleep(800);
    console.log('\n[X] CHAOS VECTOR COMPLETE. INFRASTRUCTURE IS NOW OFFLINE.');
    console.log('===========================================================');
    console.log('>> AWAITING ATOMIC ROLLBACK PROTOCOL...\n');
}

executeChaosVector();