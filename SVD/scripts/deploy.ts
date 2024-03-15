import { ethers } from "hardhat";

async function main() {
  const lock = await ethers.deployContract("Shavacadoo", ["0x412948f4D605b51cE2F9e566d7708Cb759BA891e"]);

  await lock.waitForDeployment();

  console.log(
    `Token deployed to ${lock.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});