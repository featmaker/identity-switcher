chrome.runtime.onMessage.addListener(async (message) => {
  if (message.key === "syncRecords") {
    const records = message.records;
    for (const record of records) {
      const cookie = await chrome.cookies.get({
        name: record.cookie,
        url: record.detectDomain,
      });
      if (cookie) {
        chrome.cookies.set({
          url: record.targetDomain,
          name: record.cookie,
          value: cookie.value,
          expirationDate: cookie.expirationDate,
        });
      }
    }
  }
});
