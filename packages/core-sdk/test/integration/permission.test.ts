import { expect } from "chai";
import { StoryClient, StoryConfig, Client, AddressZero } from "../../src";
import { sepolia } from "viem/chains";
import { Hex, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

describe("Permission Functions", () => {
  let client: Client;
  let senderAddress: string;

  before(function () {
    const config: StoryConfig = {
      chain: sepolia,
      transport: http(process.env.RPC_PROVIDER_URL),
      account: privateKeyToAccount((process.env.WALLET_PRIVATE_KEY || "0x") as Hex),
    };

    senderAddress = config.account.address;
    client = StoryClient.newClient(config);
  });

  describe("Set Permission", async function () {
    it("should not throw error when setting permission", async () => {
      const waitForTransaction: boolean = false;

      // TODO: this test is failing because only the IPAccount/IPAsset owner can set permission for the IPAccount. (wrong wallet)
      const response = await expect(
        client.permission.setPermission({
          ipAsset: "0x0F710802c59255110874c58d9051e545f6e75D96",
          signer: "0x9A3A5EdDDFEe1E3A1BBef6Fdf0850B10D4979405",
          to:
            (process.env.LICENSE_REGISTRY as string) ||
            (process.env.NEXT_PUBLIC_LICENSE_REGISTRY as string) ||
            "0x4B8d88967Fd4f2FFF1c85c74DA20cCcF62Cb6e47",
          func: "0x00000000",
          permission: 1,
          txOptions: {
            waitForTransaction: waitForTransaction,
          },
        }),
      ).to.not.be.rejected;

      expect(response.txHash).to.be.a("string");
      expect(response.txHash).not.empty;
    });
  });
});