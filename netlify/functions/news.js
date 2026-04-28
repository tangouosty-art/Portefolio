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
    "cybersecurity AI vulnerability detection OR \"intelligence artificielle securite\" OR \"faille web IA\""
  );
  const url = `https://newsapi.org/v2/everything?q=${q}&language=fr&sortBy=publishedAt&pageSize=6&apiKey=${apiKey}`;

  return new Promise((resolve) => {
    https.get(url, (res) => {
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
