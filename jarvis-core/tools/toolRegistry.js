export const tools = {
  getTime: () => {
    return new Date().toLocaleTimeString();
  },

  getDate: () => {
    return new Date().toLocaleDateString();
  },

  systemInfo: () => {
    return {
      platform: process.platform,
      nodeVersion: process.version
    };
  }
};
