**Règles de gestion générales**

1. **Connexion API** :

• Les données des cryptomonnaies doivent être récupérées via l’API CoinGecko.

• Les appels API doivent être optimisés pour réduire la surcharge et respecter les limitations de requêtes.

2. **Persistances des données** :

• Les données du portefeuille (wallet) et les paramètres utilisateur doivent être stockées localement via **IndexedDB** ou **LocalStorage**, avec des sauvegardes pour éviter la perte de données en cas de vidage du cache.

• Une mise à jour périodique des données des cryptomonnaies doit être déclenchée pour garantir l’affichage des valeurs en temps réel.

3. **Évolution en temps réel** :

• Les valeurs des cryptomonnaies doivent être actualisées automatiquement ou à intervalle régulier.

**Règles de gestion pour la page d’accueil (via CryptoContext)**

1. **Affichage des données crypto** :

• L’utilisateur doit voir une liste des cryptomonnaies populaires avec leurs informations principales :

• Nom.

• Prix actuel.

• Variation sur 24h (%).

• Tableau et Graphique en sparklines (par exemple via **Chart.js**).

2. **Tri et recherche** :

• Une barre de recherche permet de filtrer les cryptomonnaies par nom.

• Un tri doit être possible par capitalisation, prix ou variation.

3. **Modes d’affichage** :

• Les utilisateurs doivent pouvoir basculer entre un affichage clair et sombre grâce à **next-themes**.

**Règles de gestion pour la page Portfolio (via PortfolioContext)**

1. **Ajout de cryptomonnaies au portefeuille** :

• L’utilisateur peut ajouter une cryptomonnaie en spécifiant :

• La quantité possédée.

• Le prix d’achat moyen (optionnel).

• Les informations doivent être enregistrées localement.

2. **Calculs de portefeuille** :

• Afficher pour chaque cryptomonnaie :

• Quantité totale.

• Valeur actuelle (quantité × prix actuel).

• Plus-value ou moins-value (% et absolue).

3. **Affichage global du portefeuille** :

• Total des actifs en euros ou dollars.

• Pourcentage de gain ou perte global.

4. **Graphique d’évolution** :

• Un graphique (via **Chart.js**) montrant l’évolution de la valeur totale du portefeuille sur une période (semaine, mois, an).

**Fonctionnalités spécifiques**

1. **Notifications d’alertes** (optionnel) :

• Permettre à l’utilisateur de configurer des alertes locales (sans backend) pour les variations de prix spécifiques.

2. **Personnalisation** :

• Offrir la possibilité de réorganiser les colonnes de données affichées.

• Choisir entre différentes devises (EUR, USD, etc.).

3. **Accessibilité** :

• Garantir que l’application est accessible, en particulier avec l’utilisation de TailwindCSS et Shadcn UI pour les composants respectant les normes WCAG.
