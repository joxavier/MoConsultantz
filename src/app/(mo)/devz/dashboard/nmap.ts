// Real network scanning requires the `nmap` binary and LAN access, neither of
// which is available in a serverless deployment (e.g. Vercel). This returns a
// placeholder device list so the dashboard has something to render until a
// real scan source (an on-prem agent reporting in, etc.) is wired up.
export const scanNetwork = (): Promise<string[]> => {
  return Promise.resolve(["Phone", "Desktop"]);
};
