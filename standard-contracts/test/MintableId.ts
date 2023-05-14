import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

import { expect } from "chai";
import { ethers } from "hardhat";

import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

describe("MintableId", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    // console.log('account', owner.address, otherAccount.address)

    const Mintable = await ethers.getContractFactory("MintableId");
    const mintable = await Mintable.connect(owner).deploy("SuperToken", "SuperToken", "http://google.com/");
    // const mintable = await Mintable.attach("");
    console.log('mintable address:', mintable.address)

    return { mintable, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should be mintable", async function () {
      const { mintable, owner, otherAccount } = await deployFixture();

      await mintable.connect(owner).mint(owner.address, 0);
      await mintable.connect(owner).mint(otherAccount.address, 1);
      console.log("exists(0)", await mintable.exists(0));
      console.log("ownerOf(0)", await mintable.ownerOf(0));
      console.log("tokenURI(0)", await mintable.tokenURI(0));
      await mintable.setTokenURI("http://google.com/nft/");
      console.log("tokenURI(0)", await mintable.tokenURI(0));
    });

    it("Should be mintable in batch", async function () {
      const { mintable, owner, otherAccount } = await deployFixture();

      await mintable.connect(owner).mintBatch([owner.address, otherAccount.address], [0,1]);
      console.log("ownerOf(0)", await mintable.ownerOf(0));
      console.log("ownerOf(1)", await mintable.ownerOf(1));

      console.log(await mintable.DEFAULT_ADMIN_ROLE())
      let adminRole = await mintable.DEFAULT_ADMIN_ROLE()
      let minterRole = await mintable.MINTER_ROLE()
      console.log(await mintable.hasRole(adminRole, owner.address));
      console.log(await mintable.hasRole(adminRole, owner.address));

      await expect(mintable.connect(otherAccount).mintBatch([owner.address, otherAccount.address], [3,4])).revertedWith("caller is not a minter");
      
      await mintable.connect(owner).grantRole(minterRole, otherAccount.address)

      console.log(await mintable.hasRole(minterRole, otherAccount.address));
      await mintable.connect(otherAccount).mintBatch([owner.address, otherAccount.address], [5,6]);
    });

  });
});
