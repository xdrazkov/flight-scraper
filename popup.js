document.addEventListener('DOMContentLoaded', function() {
    var fetchButton = document.getElementById('scrapeButton');
    var resultDiv = document.getElementById('result');
  
    fetchButton.addEventListener('click', function() {
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
