// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Oracle {
  address owner;
 mapping(string => stu) public dollars;
   struct stu{
        string code;
        string name;
        string value;
    }

  constructor() public {
    owner = msg.sender;
  }

 function set(string memory _code,string memory _name,string memory _value) public onlyOwner {
      dollars[_code] = stu(_code,_name, _value);
  }

  function get(string memory _code) view public returns (string memory _value) {
    return (dollars[_code].value);
  }

  event __calbackNewDollarValueData();

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only owner');
    _;
  }

  function update() public onlyOwner {
    emit __calbackNewDollarValueData();
  }

}
