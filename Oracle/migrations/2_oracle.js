const Crud = artifacts.require("Oracle");

module.exports = function(deployer) {
    deployer.deploy(Crud);
};