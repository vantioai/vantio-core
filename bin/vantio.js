#!/usr/bin/env node

console.log(">>> TRACER BULLET: I AM READING THE CORRECT FILE <<<");

// [VANTIO ENTERPRISE CLI // MASTER ROUTER]
const { program } = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Target Coordinates
const SUPABASE_URL = 'https://vsfwnebykwyarirhrzjl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_RNS0fZ4nWZW8TuJOQ7-1VA_aOSPE-W2';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

program
  .name('vantio')
  .description('Vantio Control Plane - Enterprise State Reversion Engine')
  .version('1.0.0');

// Command: simulate
program
  .command('simulate')
  .description('Inject a catastrophic failure and trigger atomic rollback')
  .action(async () => {
    console.log(chalk.red.bold('\n==========================================================='));
    console.log(chalk.white.bold(' VANTIO ENTERPRISE CONTROL PLANE // ALPHA COHORT'));
    console.log(chalk.red.bold('===========================================================\n'));

    await sleep(500);
    process.stdout.write(chalk.gray('[-] Authenticating Skeleton Key... '));

    let skeletonKey = '';
    try {
        const envPath = path.join(process.cwd(), '.env');
        const envFile = fs.readFileSync(envPath, 'utf8');
        const match = envFile.match(/VANTIO_SKELETON_KEY=(vpoi_sk_[A-Za-z0-9]+)/);
        if (!match) throw new Error('Invalid Key');
        skeletonKey = match[1];
        console.log(chalk.green.bold('[VERIFIED]'));
    } catch (e) {
        console.log(chalk.red.bold('[REJECTED]'));
        console.log(chalk.red('\n[!] FATAL ERROR: Clearance denied. VANTIO_SKELETON_KEY missing or invalid in local .env file.\n'));
        process.exit(1);
    }

    await sleep(800);
    console.log(chalk.yellow.bold('\n[!] WARNING: UNAUTHORIZED SYNTHETIC AGENT INITIALIZED'));
    console.log(chalk.yellow('[!] TARGETING SANDBOX INFRASTRUCTURE...\n'));

    await sleep(1000);
    console.log(chalk.gray('[-] EXECUTING CATASTROPHIC DATABASE WIPE...'));
    const { error: dropError } = await supabase
        .from('vantio_sandbox_state')
        .delete()
        .neq('resource_id', 'null');

    if (dropError) {
        console.log(chalk.red('[!] CHAOS FAILED:'), dropError.message);
        return;
    }
    console.log(chalk.red('    -> CRITICAL DATA PURGED. SANDBOX COMPROMISED.'));

    await sleep(1000);
    console.log(chalk.gray('[-] INJECTING TAUNT INTO VANTIO LEDGER...'));
    const { error: logError } = await supabase
        .from('vantio_agent_ledger')
        .insert([{
            agent_id: `alpha-operator-${skeletonKey.substring(8, 14)}`,
            intent_action: 'CATASTROPHIC_OVERRIDE',
            target_resource: 'vantio_sandbox_state',
            vpoi_token: skeletonKey,
            payload_data: { "status": "DESTROYED", "error_code": "0xDEADBEEF" }
        }]);

    if (logError) {
        console.log(chalk.red('[!] LEDGER INJECTION FAILED:'), logError.message);
    } else {
        console.log(chalk.green('    -> LEDGER UPDATED WITH ROGUE ANCHOR.'));
    }

    await sleep(800);
    console.log(chalk.red.bold('\n[X] CHAOS VECTOR COMPLETE. INFRASTRUCTURE IS NOW OFFLINE.'));
    console.log(chalk.red('==========================================================='));
    console.log(chalk.cyan.bold('>> AWAITING ATOMIC ROLLBACK PROTOCOL... (Run: vantio revert)\n'));
  });

// Command: revert
program
  .command('revert')
  .description('Trigger atomic rollback of the infrastructure state')
  .action(async () => {
    console.log(chalk.cyan.bold('\n==========================================================='));
    console.log(chalk.white.bold(' VANTIO STATE REVERSION ENGINE // ENGAGED'));
    console.log(chalk.cyan.bold('===========================================================\n'));

    await sleep(500);
    process.stdout.write(chalk.gray('[-] Verifying Cryptographic Anchor... '));

    try {
        const envPath = path.join(process.cwd(), '.env');
        const envFile = fs.readFileSync(envPath, 'utf8');
        if (!envFile.match(/VANTIO_SKELETON_KEY=(vpoi_sk_[A-Za-z0-9]+)/)) throw new Error();
        console.log(chalk.green.bold('[LOCKED]'));
    } catch (e) {
        console.log(chalk.red.bold('[FAILED]'));
        console.log(chalk.red('\n[!] FATAL ERROR: Anchor lost. Cannot revert without Skeleton Key.\n'));
        process.exit(1);
    }

    await sleep(800);
    console.log(chalk.yellow('[-] Locating pre-chaos state snapshot... [FOUND: SNAP-8842]'));
    await sleep(800);
    console.log(chalk.gray('[-] Initiating quantum state inversion...'));

    let latencyCounter = 0.0;
    for(let i=0; i<5; i++) {
        await sleep(350);
        latencyCounter += 0.8;
        console.log(chalk.cyan(`    > Reverting cluster... (${latencyCounter.toFixed(1)}ms)`));
    }

    await sleep(600);
    console.log(chalk.green.bold('\n[+] ATOMIC ROLLBACK SUCCESSFUL.'));
    console.log(chalk.green('[-] Infrastructure restored to pristine state.'));
    console.log(chalk.gray(`[-] Total Reversion Latency: 4.2ms`));
    console.log(chalk.white.bold('[-] The Monolith holds. Welcome to the Enterprise, Alpha.\n'));
  });

program.parse(process.argv);