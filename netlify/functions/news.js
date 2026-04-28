const https = require("https");

exports.handler = async (event) => {
  const apiKey = process.env.NEWSAPI_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "NEWSAPI_KEY non configurée dans les variables d'environnement Netlify." })
    };
  }

  const q = encodeURIComponent(
    "cybersecurity AI OR \"artificial intelligence\" hacking OR malware OR \"vulnerability\" OR \"data breach\""
  );
  const url = `https://newsapi.org/v2/everything?q=${q}&language=en&sortBy=publishedAt&pageSize=6&apiKey=${apiKey}&domains=thehackernews.com,securityweek.com,wired.com,bleepingcomputer.com,krebsonsecurity.com`;

  const options = {
    headers: {
      "User-Agent": "PortfolioQueren/1.0",
      "X-Api-Key": apiKey
    }
  };

  return new Promise((resolve) => {
    https.get(url, options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        resolve({
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
          body: data
        });
      });
    }).on("error", (err) => {
      resolve({
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: err.message })
      });
    });
  });
};
