pragma solidity ^0.5.0;

contract Confirmation {
    address[12] public confirmors;

    function confirm(uint productId) public returns (uint) {
        require(productId >= 0 && productId <=11);
        confirmors[productId] = msg.sender;
        return productId;
    }

    function getConfirmors() public view returns (address[12] memory) {
        return confirmors;
    }
}