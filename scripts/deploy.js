const fs = require("fs");
const path = require("path");
const FtpDeploy = require("ftp-deploy");

// Manually load .env.local since this is a plain Node script
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .forEach((line) => {
      const [key, ...rest] = line.split("=");
      if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
    });
} else {
  console.error("❌ .env.local not found. Create it with FTP_USER and FTP_PASS.");
  process.exit(1);
}

const ftpDeploy = new FtpDeploy();

const config = {
  user: process.env.FTP_USER,
  password: process.env.FTP_PASS,
  host: "ftp.mikeetaylor.com",
  port: 21,
  localRoot: path.resolve(__dirname, "../out"),
  remoteRoot: "/mikeetaylor.com/",
  include: ["*", "**/*"],
  exclude: [],
  deleteRemote: false,
  forcePasv: true,
};

console.log(`📡 Connecting as ${config.user}...`);

ftpDeploy
  .deploy(config)
  .then(() => console.log("✅ Deployed successfully to mikeetaylor.com"))
  .catch((err) => console.error("❌ Deploy failed:", err));

ftpDeploy.on("uploading", (data) => {
  console.log(`  ↑ ${data.transferredFileCount}/${data.totalFilesCount} — ${data.filename}`);
});
