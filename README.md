# Vantio Control Plane 
**Enterprise State Reversion & Chaos Engineering Engine**

Vantio allows infrastructure and database engineering teams to simulate catastrophic failures and instantly execute sub-5-second atomic rollbacks via a proprietary quantum state inversion sequence.

## Global Installation
Vantio is distributed globally via the NPM registry. Install the CLI directly to your local machine:

```bash
npm install -g vantio-control-plane
```

## Authentication
To interface with the Vantio Control Plane, you must have an active Skeleton Key. 
Create a `.env` file in your working directory and inject your clearance token:

```env
VANTIO_SKELETON_KEY=vpoi_sk_YOUR_TOKEN_HERE
```

## Command Interface

**1. Inject Chaos (Simulation Mode)**
Targets your active cluster and triggers a catastrophic database wipe to test system resilience.

```bash
vantio simulate
```

**2. Atomic Rollback (Reversion Engine)**
Engages the Vantio Ledger to locate the pre-chaos state snapshot and instantly restores your infrastructure.

```bash
vantio revert
```

---
*Vantio Engineering // The Monolith Holds.*