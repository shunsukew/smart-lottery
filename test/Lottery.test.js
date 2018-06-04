const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const {interface, bytecode } = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: "0x" + bytecode})
        .send({from: accounts[0], gas: "1000000"});
})

describe("Lottery cotract test", () => {
    it("successfully deployed contract", () => {
        assert.ok(lottery.options.address);
    });

    it("allows users to participate in the lottery", async () => {
        await lottery.methods.participate().send({
            from: accounts[0],
            value: web3.utils.toWei("0.02", "ether")
        });

        await lottery.methods.participate().send({
            from: accounts[1],
            value: web3.utils.toWei("0.02", "ether") 
        });

        await lottery.methods.participate().send({
            from: accounts[2],
            value: web3.utils.toWei("0.02", "ether") 
        });

        const participants = await lottery.methods.viewEntries().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], participants[0]);
        assert.equal(accounts[1], participants[1]);
        assert.equal(accounts[2], participants[2]);

        assert.equal(3, participants.length);
    });
})