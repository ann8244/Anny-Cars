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
 
 