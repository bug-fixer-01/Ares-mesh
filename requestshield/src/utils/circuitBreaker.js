let failureCount = 0;
let circuitOpenUntil = null;

const FAILURE_THRESHOLD = 5;
const RESET_TIMEOUT = 10000; // 10 sec

export const canProceed = () => {
  if (!circuitOpenUntil) return true;

  if (Date.now() > circuitOpenUntil) {
    failureCount = 0;
    circuitOpenUntil = null;
    return true;
  }

  return false;
};

export const recordFailure = () => {
  failureCount++;

  if (failureCount >= FAILURE_THRESHOLD) {
    circuitOpenUntil = Date.now() + RESET_TIMEOUT;
  }
};

export const recordSuccess = () => {
  failureCount = 0;
  circuitOpenUntil = null;
};
