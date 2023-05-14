import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

import { expect } from "chai";
import { ethers } from "hardhat";

import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

describe("Mintable", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    // console.log('account', owner.address, otherAccount.address)

    const Mintable = await ethers.getContractFactory("Mintable");
    const mintable = await Mintable.connect(owner).deploy("SuperToken", "SuperToken", "http://google.com/");
    // const mintable = await Mintable.attach("");
    console.log('mintable address:', mintable.address)

    return { mintable, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should be mintable", async function () {
      const { mintable, owner, otherAccount } = await deployFixture();

      await mintable.deployTransaction.wait()
      console.log('deployed')

      await mintable.connect(owner).mint(owner.address);
      console.log("exists(1)", await mintable.exists(1));
      console.log("ownerOf(1)", await mintable.ownerOf(1));
      console.log("tokenURI(1)", await mintable.tokenURI(1));
    });

  });
});
