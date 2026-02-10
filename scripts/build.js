const fs = require("fs");
const { spawn } = require("child_process");

function getDeploymentDomain() {
  if (process.env.REPLIT_INTERNAL_APP_DOMAIN) {
    return stripProtocol(process.env.REPLIT_INTERNAL_APP_DOMAIN);
  }

  if (process.env.REPLIT_DEV_DOMAIN) {
    return stripProtocol(process.env.REPLIT_DEV_DOMAIN);
  }

  if (process.env.EXPO_PUBLIC_DOMAIN) {
    return stripProtocol(process.env.EXPO_PUBLIC_DOMAIN);
  }

  console.error(
    "ERROR: No deployment domain found. Set REPLIT_INTERNAL_APP_DOMAIN, REPLIT_DEV_DOMAIN, or EXPO_PUBLIC_DOMAIN",
  );
  process.exit(1);
}

function stripProtocol(domain) {
  let urlString = domain.trim();
  if (!/^https?:\/\//i.test(urlString)) {
    urlString = `https://${urlString}`;
  }
  return new URL(urlString).host;
}

async function buildWeb(domain) {
  console.log("Building web app...");
  console.log(`Setting EXPO_PUBLIC_DOMAIN=${domain}`);

  if (fs.existsSync("dist/web")) {
    fs.rmSync("dist/web", { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      EXPO_PUBLIC_DOMAIN: domain,
    };
    const webBuild = spawn(
      "npx",
      ["expo", "export", "--platform", "web", "--output-dir", "dist/web"],
      {
        stdio: ["ignore", "pipe", "pipe"],
        env,
      },
    );

    webBuild.stdout.on("data", (data) => {
      const output = data.toString().trim();
      if (output) console.log(output);
    });
    webBuild.stderr.on("data", (data) => {
      const output = data.toString().trim();
      if (output) console.error(output);
    });
    webBuild.on("close", (code) => {
      if (code === 0) {
        console.log("Web build complete!");
        resolve();
      } else {
        reject(new Error(`Web build failed with exit code ${code}`));
      }
    });
  });
}

async function main() {
  const domain = getDeploymentDomain();
  console.log(`Deploying to: https://${domain}`);
  await buildWeb(domain);
}

main().catch((error) => {
  console.error("Build failed:", error.message);
  process.exit(1);
});
