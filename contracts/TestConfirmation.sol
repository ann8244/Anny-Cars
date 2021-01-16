pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Confirmation.sol";

contract TestConfirmation {
  // The address of the confirmation contract to be tested
  Confirmation confirmation = Confirmation(DeployedAddresses.Confirmation());

  // The id of the product that will be used for testing
  uint expectedProductId = 8;

  //The expected owner of confirmed product is this contract
  address expectedConfirmor = address(this);

  function testUserCanConfirmProduct() public {
    uint returnedId = confirmation.confirm(expectedProductId);
    Assert.equal(returnedId, expectedProductId, "Confirmation of the expected product should match what is returned.");
  }

  // Testing retrieval of a single product's owner
  function testGetConfirmorAddressByProductId() public {
    address confirmor = confirmation.confirmors(expectedProductId);
    Assert.equal(confirmor, expectedConfirmor, "Owner of the expected product should be this contract");
  }

  // Testing retrieval of all product owners
  function testGetConfirmorAddressByProductIdInArray() public {
    // Store confirmors in memory rather than contract's storage
    address[12] memory confirmors = confirmation.getConfirmors();
    Assert.equal(confirmors[expectedProductId], expectedConfirmor, "Owner of the expected product should be this contract");
  }
}