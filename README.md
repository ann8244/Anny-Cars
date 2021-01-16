# ANNNY CAR

Project นี้เป็นการจำลอง Web-Based DApp สำหรับการจองรถสำหรับผู้สนใจรถ
โดยมีวิธีการต่างๆ ดังนี้

## กำหนดค่าสิ่งแวดล้อม
สร้าง Directory สำหรับบันทึก Projectนี้ และ ใช้คำสั่งต่อไปนี้เพื่อสร้างและย้ายเข้าไปยัง Directory ชื่อ Annny car
```
mkdir Annny car
cd Annny car
```

ดาวน์โหลด pet-shop ซึ่งมีอยู่ใน Truffle Framework โดยใช้คำสั่งต่อไปนี้

```
truffle unbox pet-shop
```
ทดลองใช้คำสั่ง ls -l เพื่อดูโครงสร้างของโปรเจ็ค สังเกตว่า มีไดเร็กทอรีและไฟล์ที่สำคัญต่อไปนี้  

![ภาพที่ 1 แสดงการใช้คำสั่ง ls](https://user-images.githubusercontent.com/74086041/104798673-3dca2d80-57fb-11eb-9252-944199010eec.JPG)

contracts: เป็นไดเร็กทอรีที่ใช้เก็บ Smart Contracts ที่เขียนด้วยภาษา Solidity  
migrations: เป็นไดเร็กทอรีที่ใช้เก็บไฟล์ JavaScript ซึ่งเป็นโค้ดที่ใช้ในการจัดการ Smart Contracts ให้ลงไปยังบล็อกเชน  
src: เป็นไดเร็กทอรีที่ใช้เก็บไฟล์ที่เกี่ยวข้องกับ Web Application เช่น JavaScript, CSS, HTML, images เป็นต้น  
test: เป็นไดเร็กทอรีใช้ที่เก็บไฟล์ Solidity หรือ JavaScript ก็ได้ ที่ใช้เพื่อทดสอบ Smart Contracts  
truffle-config.js: คือไฟล์ที่ใช้ในการกำหนดค่าของโปรเจ็ค 
  
### สร้าง Smart Contract
### 1. Adoption Smart Contract
ใช้ Visual Studio Code เพื่อสร้างไฟล์ชื่อ Confirm.sol ในไดเร็กทอรี contracts โดยมีโค้ดดังนี้

```
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
```

### 2. Compile และ Migrate
ทำการคอมไฟล์ Smart Contracts โดยใช้คำสั่ง
```
truffle compile
```

ใช้ Visual Studio Code ในการสร้างไฟล์ 2_deploy_contracts.js ในไดเร็กทอรี migrations ดังนี้
```
var Confirmation = artifacts.require("Confirmation");

module.exports = function(deployer) {
  deployer.deploy(Confirmation);
};
```
เปิดโปรแกรม Ganache โดยการใช้เมาส์ดับเบิลคลิกที่ชื่อไฟล์ จากนั้นคลิกที่ New Workspace ในกรณีที่ใช้งานครั้งแรก  
ครั้งต่อไปไม่จำเป็นต้องสร้าง Workspace ใหม่ทุกครั้ง 
เมื่อ Ganache ทำงานได้ดังรูปข้างต้น  

![Ganach1](https://user-images.githubusercontent.com/74086041/104798687-563a4800-57fb-11eb-9a51-aad9ee4638be.JPG)
![Ganach2](https://user-images.githubusercontent.com/74086041/104798686-54708480-57fb-11eb-8128-b9914cba00ec.JPG)

ขั้นตอนต่อไปคือการ migrate ทำได้โดยใช้คำสั่งต่อไปนี้
```
truffle migrate
```
ทดสอบ Smart Contract
ใช้ Visual Studio Code ในการสร้างไฟล์ Testconfirm.sol เพื่อทดสอบ comfirm.sol และบันทึกลงในไดเร็กทอรี test แก้ไข Code ให้เป็นดังต่อไปนี้
```
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
```

### 3. แก้ไขในส่วนของ ไดเร็คทอรี่ src (Back-end)

#### 3.1 แก้ไขไฟล์ภาพ
ให้นำไฟล์ภาพที่ต้องการแสดงผลไปไว้ในไดเร็คทอรี่ image ทั้ง 12 ภาพ

#### 3.2 แก้ไข File.json
แก้ไข Code ให้เป็นดังต่อไปนี้
```
[
  {
    "id": 0,
    "name": "CHEVROLET AVEO",
    "picture": "images/1.jpg",
    "year": 2011,
    "downpayment": "ดาวน์ 5,000 บาท",
    "fullprice": "149,000 บาn"
  },
  {
    "id": 1,
    "name": "BMW 3301 SE E90 Auto",
    "picture": "images/2.jpg",
    "year": 2013,
    "downpayment": "Free Down",
    "fullprice": "799,000 บาn"
  },
  {
    "id": 2,
    "name": "CHEVROLET COLARADO",
    "picture": "images/3.jpg",
    "year": 2012,
    "downpayment": "ดาวน์ 9,000 บาท",
    "fullprice": "279,000 บาn"
  },
  {
    "id": 3,
    "name": "CHEVROLET OPTRA (MNC)",
    "picture": "images/4.jpg",
    "year": 2009,
    "downpayment": "Free Down",
    "fullprice": "99,000 บาn"
  },
  {
    "id": 4,
    "name": "CHEVROLET COLARADO",
    "picture": "images/5.jpg",
    "year": 2019,
    "downpayment": "Fดาวน์ 15,000 บาท",
    "fullprice": "429,000 บาn"
  },
  {
    "id": 5,
    "name": "CHEVROLET COLARADO",
    "picture": "images/6.jpg",
    "year": 2019,
    "downpayment": "ดาวน์ 15,000 บาท",
    "fullprice": "375,000 บาn"
  },
  {
    "id": 6,
    "name": "CHEVROLET COLARADO",
    "picture": "images/7.jpg",
    "year": 2019,
    "downpayment": "ดาวน์ 25,000 บาท",
    "fullprice": "439,000 บาn"
  },
  {
    "id": 7,
    "name": "CHEVROLET OPTRA (MNC)",
    "picture": "images/8.jpg",
    "year": 2010,
    "downpayment": "ดาวน์ 9,000 บาท",
    "fullprice": "139,000 บาn"
  },
  {
    "id": 8,
    "name": "CHEVROLET SONIC SEDAN",
    "picture": "images/9.jpg",
    "year": 2015,
    "downpayment": "ดาวน์ 9,000 บาท",
    "fullprice": "225,000 บาn"
  },
  {
  "id": 9,
  "name": "CHEVROLET SONIC SEDAN",
  "picture": "images/10.jpg",
  "year": 2014,
  "downpayment": "ดาวน์ 9,000 บาท",
  "fullprice": "179,000 บาn"
  },
  {
  "id": 10,
  "name": "CHEVROLET CRUZE",
  "picture": "images/11.jpg",
  "year": 2013,
  "downpayment": "Free Down",
  "fullprice": "239,000 บาn"
  },
  {
  "id": 11,
  "name": "CHEVROLET CRUZE (MNC)",
  "picture": "images/12.jpg",
  "year": 2014,
  "downpayment": "ดาวน์ 5,000 บาท",
  "fullprice": "149,000 บาn"
  }
]

```
#### 3.3 Edit app.js
ทำการแก้ไขตัวแปรต่างๆ  ให้เป็นดัง Code ด้านล่าง

```
App = {
  web3Provider: null,
  contracts: {},
  
  init: async function() {
    // Load products.
    $.getJSON('../products.json', function(data) {
      var productsRow = $('#productsRow');
      var productTemplate = $('#productTemplate');
  
      for (i = 0; i < data.length; i ++) {
        productTemplate.find('.panel-title').text(data[i].name);
        productTemplate.find('img').attr('src', data[i].picture);
        productTemplate.find('.product-downpayment').text(data[i].downpayment);
        productTemplate.find('.product-year').text(data[i].year);
        productTemplate.find('.product-fullprice').text(data[i].fullprice);
        productTemplate.find('.btn-confirm').attr('data-id', data[i].id);
  
        productsRow.append(productTemplate.html());
      }
    });
  
    return await App.initWeb3();
  },
  
  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
 //    else if (window.web3) {
 //      App.web3Provider = window.web3.currentProvider;
 //    }
    // If no injected web3 instance is detected, fall back to Ganache
 //    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
 //    }
    web3 = new Web3(App.web3Provider);
  
    return App.initContract();
  },
  
  initContract: function() {
    $.getJSON('Confirmation.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var ConfirmationArtifact = data;
      App.contracts.Confirmation = TruffleContract(ConfirmationArtifact);
  
      // Set the provider for our contract
      App.contracts.Confirmation.setProvider(App.web3Provider);
  
      // Use our contract to retrieve and mark the adopted products
      return App.markConfirmed();
    });
    return App.bindEvents();
  },
  
  bindEvents: function() {
    $(document).on('click', '.btn-confirm', App.handleConfirm);
  },
  
  markConfirmed: function() {
    var confirmationInstance;
  
    App.contracts.Confirmation.deployed().then(function (instance) {
      confirmationInstance = instance;
  
      return confirmationInstance.getConfirmors.call();
    }).then(function (confirmors) {
      for (i = 0; i < confirmors.length; i++) {
        if (confirmors[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-product').eq(i).find('button').text('Reserved').attr('disabled', true);
        }
      }
    }).catch(function (err) {
      console.log(err.message);
    });
  },
  
  handleConfirm: function(event) {
    event.preventDefault();
  
    var productId = parseInt($(event.target).data('id'));
  
    var confirmationInstance;
  
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
  
      var account = accounts[0];
  
      App.contracts.Confirmation.deployed().then(function (instance) {
        confirmationInstance = instance;
  
        // Execute confirm as a transaction by sending account
        return confirmationInstance.confirm(productId, { from: account });
      }).then(function (result) {
        return App.markConfirmed();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  }
  
 };
  
 $(function() {
  $(window).load(function() {
    App.init();
  
  });
 });
 
 
```

### 3. แก้ไข UI 
ทำการแก้ไขในส่วนของ Front-end ให้มี Code ต่างๆดังรูป

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Annny_Cars</title>

    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-sm-8 col-sm-push-2">
          <h1 class="text-center"><strong>Annny_Cars</strong></h1>
          <hr/>
          <br/>
        </div>
      </div>

      <div id="productsRow" class="row">
        <!-- PRODUCTS LOAD HERE -->
      </div>
    </div>

    <div id="productTemplate" style="display: none;">
      <div class="col-sm-6 col-md-4 col-lg-3">
        <div class="panel panel-default panel-product">
          <div class="panel-heading">
            <h3 class="panel-title">Scrappy</h3>
          </div>
          <div class="panel-body">
            <img alt="140x140" data-src="holder.js/140x140" class="img-rounded img-center" style="width: 100%;" src="https://animalso.com/wp-content/uploads/2017/01/Golden-Retriever_6.jpg" data-holder-rendered="true">
            <br/><br/>
            <strong>Downpayment</strong>: <span class="product-downpayment">ดาวน์ 5,000 บาท</span><br/>
            <strong>Year</strong>: <span class="product-year">2011</span><br/>
            <strong>Fullprice</strong>: <span class="product-fullprice">149,000 บาn</span><br/><br/>
            <button class="btn btn-default btn-confirm" type="button" data-id="0">Reserve</button>
          </div>
        </div>
      </div>
    </div>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/bootstrap.min.js"></script>
    <script src="js/web3.min.js"></script>
    <script src="js/truffle-contract.js"></script>
    <script src="js/app.js"></script>
  </body>
</html>

```

### 4. แสดงผลลัพธ์
ทำการแสดงผลลัพธ์โดยใช้คำสั่ง
```
npm run dev
```

![UI R1](https://user-images.githubusercontent.com/74086041/104798789-01e39800-57fc-11eb-837f-a6b297bcf2cd.JPG)

บราวเซอร์จะเรียกURL http://localhost:3000 และได้ผลลัพธ์ดังภาพ

![ภาพที่ 2 Reserve](https://user-images.githubusercontent.com/74086041/104798784-fee8a780-57fb-11eb-95b4-45b5dae47286.JPG)

เมื่อมีการกด Reserve จะถูกเปลี่ยนเป็น Reserved เพื่อแสดงว่ามีลูกค้าสนใจเค้ามาจองรถที่ร้าน Annny car

![ภาพที่ 3 Reserved](https://user-images.githubusercontent.com/74086041/104798786-00b26b00-57fc-11eb-8246-4c0481985b25.jpg)

### สรุปโปรเจ็ค
สำหรับโปรเจคนี้ Smart Contract ถูกสร้างขึ้นภายใต้ชื่อ File Confirm.sol ด้วยภาษา Solidity
ภายใต้ Contract ชื่อ Annny car
และมี Address = 12 Address สำหรับ  productId
Function Reserve สามารถ Reserve productId โดย confirmors และเปลี่ยนสถานะกลับไปยัง productId เมื่อถูก Reserve แล้ว
ส่วนที่เชื่อมต่อกับผู้ใช้งาน หรือ ส่วนของ Front-end จะอยู่ที่ไฟล์ index.html
โดยเรียกใช้ src ต่างๆ เช่น app.js เป็นต้นและปรับแต่งรูปแบบการแสดงผลต่างๆได้ที่ไฟล์นี้
ส่วนที่เป็นระบบ Back-end Coding initWeb3 เป็นการระบุว่าจะใช้ บล็อกเชนแบบใดในการเชื่อมต่อกับ smart contract โดยเริ่มจาก Metamask ,Legacy browser และ Ganache ตามลำดับ 
คำสั่ง markConfirmed เป็นการดึงเอา smart contract มาใช้ โดยสั่งการให้โปรแกรมเชื่อม wallet address เมื่อมีการกดปุ่ม "Reserve" Metamask/Ganache จะทำการคิดค่า gas ทันที 
และ UI จะแสดงผลโดยเปลี่ยนปุ่มเป็น Reserved เพื่อให้ลูกค้ารายอื่นๆทราบ ว่ารถคนนี้ได้มีผู้ในสนใจแล้ว
