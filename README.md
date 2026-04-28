# Portfolio Queren Tangou — Guide de configuration

## 🚀 Déployer sur Netlify

1. Glisse le dossier `portfolio_v2` sur https://app.netlify.com/drop
2. C'est en ligne ! Récupère l'URL.

---

## ✉️ Activer la réception d'emails (EmailJS)

**Gratuit : 200 emails/mois**

1. Va sur https://www.emailjs.com/ → "Sign Up Free"
2. Ajoute un **Service** : clique "Add New Service" → choisis Gmail ou Outlook → connecte ton compte tangouosty@gmail.com
3. Crée un **Template** : clique "Email Templates" → "Create New Template"
   - Dans le template, utilise ces variables :
     ```
     De : {{user_name}} ({{user_email}})
     Sujet : {{subject}}
     Message : {{message}}
     ```
4. Dans "Account" → "General" → copie ta **Public Key**
5. Ouvre `assets/js/main.js` et remplace ces 3 lignes :
   ```js
   const EMAILJS_SERVICE_ID  = "service_XXXXXXX";   ← ton Service ID
   const EMAILJS_TEMPLATE_ID = "template_XXXXXXX";  ← ton Template ID
   const EMAILJS_PUBLIC_KEY  = "aBcDeFgHiJ...";     ← ta Public Key
   ```
6. Sauvegarde → redéploie → tu reçois les emails !

---

## 📰 Activer le flux d'articles NewsAPI (Veille)

**Gratuit : 100 requêtes/jour**

1. Va sur https://newsapi.org/register → crée un compte gratuit
2. Copie ta clé API dans le tableau de bord
3. Dans `index.html`, trouve :
   ```html
   <div id="newsApiKey" data-key="YOUR_NEWSAPI_KEY_HERE">
   ```
4. Remplace `YOUR_NEWSAPI_KEY_HERE` par ta clé :
   ```html
   <div id="newsApiKey" data-key="a1b2c3d4e5f6789012345678">
   ```
5. En **production** (Netlify), tu peux aussi créer une Netlify Function
   pour masquer la clé (optionnel mais recommandé).

---

## ⚠️ NewsAPI en production

La clé gratuite NewsAPI ne fonctionne que sur `localhost` pour les requêtes
côté client. En production (ton site en ligne), il faut un petit proxy.

**Solution simple avec Netlify Functions :**

Crée le fichier `netlify/functions/news.js` :
```js
const fetch = require("node-fetch");
exports.handler = async (event) => {
  const q = encodeURIComponent("cybersecurity AI vulnerability detection");
  const url = `https://newsapi.org/v2/everything?q=${q}&language=fr&sortBy=publishedAt&pageSize=6&apiKey=${process.env.NEWSAPI_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  };
};
```

Et dans `main.js`, change l'URL de fetch :
```js
const API_URL = "/.netlify/functions/news";
```

Puis dans Netlify → Site Settings → Environment Variables → ajoute `NEWSAPI_KEY` avec ta clé.

---

## 🖼️ Ajouter tes vraies captures Flexbox Froggy

Dans `index.html`, le bouton "Voir les captures" pointe vers :
`https://flexboxfroggy.com/#fr`

Pour afficher tes propres captures :
1. Fais des screenshots de tes niveaux complétés
2. Place-les dans `assets/images/froggy/` (crée le dossier)
3. Crée une page `froggy.html` avec une galerie de tes captures
4. Change le href du bouton vers `froggy.html`

---

## 📁 Structure du projet

```
portfolio_v2/
├── index.html              ← Page principale
├── assets/
│   ├── css/style.css       ← Tous les styles
│   ├── js/main.js          ← Tout le JavaScript
│   └── images/             ← Tes images et documents
│       ├── photocv.jpg
│       ├── mockup.png
│       ├── mockup1.png
│       ├── cat.png
│       ├── canva.svg
│       ├── New_cv.pdf
│       └── DEL.pdf
└── README.md               ← Ce fichier
```
