// Script to submit URLs to IndexNow (Bing, DuckDuckGo, Yahoo, Yandex, Seznam, Naver)
const KEY = 'e82b7194c65345d2925b68233d4e6819';
const HOST = 'globaltrades-calicut.vercel.app';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URLS = [
  `https://${HOST}/`,
  `https://${HOST}/products`,
  `https://${HOST}/brands`,
  `https://${HOST}/contact`
];

async function submitIndexNow() {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS
  };

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Submitting ${URLS.length} URLs to ${endpoint}...`);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      console.log(`Response from ${endpoint}: status ${res.status} (${res.statusText})`);
      if (res.status === 200 || res.status === 202) {
        console.log(`✓ Successfully submitted to ${endpoint}`);
      } else {
        const text = await res.text();
        console.log(`Note: Response body: ${text}`);
      }
    } catch (err) {
      console.error(`Error submitting to ${endpoint}:`, err.message);
    }
  }
}

submitIndexNow();
