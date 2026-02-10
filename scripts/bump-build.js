#!/usr/bin/env node

/**
 * Bump build number in build.json before each push.
 * Usage: node scripts/bump-build.js
 *
 * Reads the current build.json, increments buildNumber,
 * stamps the latest commit hash + date, and writes it back.
 * The updated build.json is auto-staged so it's included in the push.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BUILD_FILE = path.join(__dirname, "..", "build.json");

// Read current build info
const build = JSON.parse(fs.readFileSync(BUILD_FILE, "utf-8"));

// Increment build number
build.buildNumber += 1;

// Get latest commit hash (short)
try {
  build.lastCommit = execSync("git rev-parse --short HEAD", {
    encoding: "utf-8",
  }).trim();
} catch {
  // keep existing if git fails
}

// Stamp build date
build.lastBuildDate = new Date().toISOString();

// Write back
fs.writeFileSync(BUILD_FILE, JSON.stringify(build, null, 2) + "\n", "utf-8");

console.log(
  `Build bumped to #${build.buildNumber} (v${build.version}, ${build.lastCommit})`
);
