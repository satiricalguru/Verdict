/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require("child_process");

const devProcess = spawn("npx", ["next", "dev"], {
  stdio: "inherit",
  shell: true,
});

let opened = false;

function launchBrowser() {
  if (opened) return;
  opened = true;
  const url = "http://localhost:3000";
  const command =
    process.platform === "darwin"
      ? `open "${url}"`
      : process.platform === "win32"
      ? `start "${url}"`
      : `xdg-open "${url}"`;

  spawn(command, { shell: true, stdio: "ignore" });
}

// Auto open browser after server initializes
setTimeout(launchBrowser, 2500);

process.on("SIGINT", () => {
  devProcess.kill("SIGINT");
  process.exit();
});
