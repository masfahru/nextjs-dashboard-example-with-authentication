module.exports = {
  apps: {
    name: "dashboard",
    script: "node_modules/next/dist/bin/next",
    args: "start",
    instances: "max",
    exec_mode: "cluster",
    autorestart: true,
    watch: false,
    env: {
      ...process.env,
    },
  },
};
