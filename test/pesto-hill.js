const { ethers } = require("hardhat");
const { expect } = require("chai");

const challengeName = "Pesto-Hill Challenge";

describe(challengeName, function () {
  let alice, bob;

  const INITIAL_BRIBE = ethers.utils.parseEther("1");

  before(async function () {
    /** SETUP SCENARIO - DON'T CHANGE ANYTHING HERE */
    [alice, bob] = await ethers.getSigners();
    const PestoHill = await ethers.getContractFactory("PestoHill", alice);

    this.PestoHill = await PestoHill.deploy(alice.address, {
      value: INITIAL_BRIBE,
    });

    expect(await this.PestoHill.bribe()).to.equal(INITIAL_BRIBE);
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE  */

    const HillAttack = await ethers.getContractFactory("HillAttack", bob);
    this.hillAttack = await HillAttack.deploy();
    this.hillAttack.connect(bob).attack(this.PestoHill.address, {
      value: ethers.utils.parseEther("1"),
    });
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    // Alice tries to reclaim the ownership...
    var bribe = await this.PestoHill.bribe();

    await expect(
      alice.sendTransaction({
        to: this.PestoHill.address,
        value: bribe,
      })
    ).to.be.reverted;

    bribe = await this.PestoHill.bribe();

    if (expect(await this.PestoHill.atTheTop()).not.to.equal(alice.address)) {
      console.log(`You have passed the ${challengeName}.`);
    }
  });
});
