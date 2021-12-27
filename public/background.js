let records = [];

chrome.runtime.onMessage.addListener((message) => {
  if (message.key === "syncRecords") {
    records = message.records;
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log(activeInfo);
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  for (const item of records) {
    if (tab.url.includes(item.targetDomain)) {
      // console.log("目标地址: ", tab.url);
      const cookie = await chrome.cookies.get({
        name: item.cookie,
        url: item.detectDomain,
      });
      // console.log("检测到 cookie: ", cookie);

      if (cookie) {
        // console.log(`设置 cookie 到目标地址: ${item.targetDomain}`);
        chrome.cookies.set({
          url: item.targetDomain,
          name: item.cookie,
          value: cookie.value,
          expirationDate: cookie.expirationDate,
        });
      }
    }
  }
});
