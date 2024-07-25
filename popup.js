document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('form');
    var scrapeButton = document.getElementById('scrapeButton');
    var resultDiv = document.getElementById('result');

    form.addEventListener('submit', function(event) {
      event.preventDefault();

      var carrier = document.querySelector('input[name="carrier"]:checked').value;
      var from = document.getElementById('from').value;
      var to = document.getElementById('to').value;
      console.log(carrier, from, to);

      chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {action: "scrape"}, function(response) {
                console.log(response)
                if (response && response.content) {
                  resultDiv.textContent = "Content: " + response.content;
                } else {
                  resultDiv.textContent = "Element not found or error occurred.";
                }
              });
      });
    });
  });
