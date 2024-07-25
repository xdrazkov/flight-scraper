chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === "scrape") {
        var element = document.getElementById("someid");
        if (element) {
          sendResponse({content: element.textContent});
        } else {
          sendResponse({content: null});
        }
      }
      return true;
    }
  );
