pragma solidity ^0.5.0;

contract Oracle {
  address owner;
  uint public dollar;

  event __calbackNewDollarValueData();

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only owner');
    _;
  }

  constructor() public {
    owner = msg.sender;
    dollar = 100;
  }

  function update() public onlyOwner {
    emit __calbackNewDollarValueData();
  }

  function set(uint _value) public onlyOwner {
    dollar = _value;
  }

  function get() view public returns (uint) {
    return dollar;
  }

}