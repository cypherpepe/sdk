import { expect } from "chai";
import { StoryClient, StoryConfig } from "../../../src";
import { Hex, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  RegistrationModuleConfig,
  IPAssetRegistryConfig,
  IPAccountABI,
  LicenseRegistryConfig,
  LicensingModuleConfig,
} from "./testABI.sepolia";

describe("IP Asset Functions", () => {
  let client: StoryClient;
  let senderAddress: string;

  before(function () {
    const config: StoryConfig = {
      chainId: "sepolia",
      transport: http(process.env.SEPOLIA_RPC_PROVIDER_URL),
      account: privateKeyToAccount((process.env.SEPOLIA_WALLET_PRIVATE_KEY || "0x") as Hex),
    };

    senderAddress = config.account.address;
    client = StoryClient.newClient(config);
    client.ipAsset.registrationModuleConfig = RegistrationModuleConfig;
    client.ipAsset.ipAssetRegistryConfig = IPAssetRegistryConfig;
    client.license.ipAccountABI = IPAccountABI;
    client.license.licenseRegistryConfig = LicenseRegistryConfig;
    client.license.licensingModuleConfig = LicensingModuleConfig;
  });

  describe("Create root IP Asset", async function () {
    it.skip("should not throw error when creating a root IP Asset", async () => {
      const waitForTransaction: boolean = true;
      const response = await expect(
        client.ipAsset.registerRootIp({
          policyId: "0",
          tokenContractAddress: "0xd516482bef63Ff19Ed40E4C6C2e626ccE04e19ED",
          tokenId: "17",
          txOptions: {
            waitForTransaction: waitForTransaction,
          },
        }),
      ).to.not.be.rejected;

      expect(response.txHash).to.be.a("string");
      expect(response.txHash).not.empty;

      if (waitForTransaction) {
        expect(response.ipId).to.be.a("string");
        expect(response.ipId).not.empty;
      }
    });
  });

  describe("Create derivative IP Asset", async function () {
    it.skip("should not throw error when creating a derivative IP Asset", async () => {
      // 1. mint a license
      const mintLicenseResponse = await client.license.mintLicense({
        policyId: "2",
        licensorIpId: "0x90daC93B2F2a6ABf44116d8A76b5C330F5A29dC0",
        mintAmount: 1,
        receiverAddress: process.env.SEPOLIA_TEST_WALLET_ADDRESS! as `0x${string}`,
        txOptions: {
          waitForTransaction: true,
        },
      });
      const licenseId = mintLicenseResponse.licenseId!;
      // 2. register derivative
      const waitForTransaction: boolean = true;
      const response = await expect(
        client.ipAsset.registerDerivativeIp({
          licenseIds: [licenseId],
          tokenContractAddress: "0xd516482bef63Ff19Ed40E4C6C2e626ccE04e19ED",
          tokenId: "9",
          txOptions: {
            waitForTransaction: waitForTransaction,
          },
        }),
      ).to.not.be.rejected;

      expect(response.txHash).to.be.a("string");
      expect(response.txHash).not.empty;

      if (waitForTransaction) {
        expect(response.ipId).to.be.a("string");
        expect(response.ipId).not.empty;
      }
    });
  });
});