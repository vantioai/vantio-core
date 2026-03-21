const crypto = require('crypto');

class VantioLinter {
    /**
     * Initializes the Vantio Linter with the Zero-Trust cryptographic salt.
     * @param {string} secretSalt - The shared secret used to hash the vPOI.
     */
    constructor(secretSalt) {
        if (!secretSalt) {
            throw new Error('[!] VANTIO LINTER FATAL: Cryptographic salt is required to initialize.');
        }
        this.secretSalt = secretSalt;
    }

    /**
     * Synthesizes a mathematically perfect Validated Proof of Intent (vPOI) token.
     * @param {string} agentId - The unique identifier of the AI agent.
     * @param {string} intentAction - The authorized action (e.g., 'CREATE', 'DELETE').
     * @param {string} targetResource - The target infrastructure (e.g., 'gcp_compute_instance').
     * @returns {string} The physical vPOI token.
     */
    generateVPOI(agentId, intentAction, targetResource) {
        const payloadString = agentId + ":" + intentAction + ":" + targetResource + ":" + this.secretSalt;
        const vpoiToken = "vpoi_" + crypto.createHash('sha256').update(payloadString).digest('hex');
        return vpoiToken;
    }
}

module.exports = VantioLinter;
