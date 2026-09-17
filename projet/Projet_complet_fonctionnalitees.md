# Monster Quest --- Résumé des fonctionnalités

> Document de référence des fonctionnalités actuellement présentes dans
> le projet.

## 🎮 1. Démarrage

-   Écran d'accueil Monster Quest.
-   Choix d'un pseudo.
-   Création de compte et connexion avec pseudo + mot de passe lorsque
    Supabase est configuré.
-   Déconnexion.
-   Sélection d'une créature de départ.
-   La créature choisie rejoint l'équipe et est enregistrée comme
    capturée dans le Pokédex.
-   Le jeu peut fonctionner sans Supabase avec une sauvegarde locale.

## 🗺️ 2. Exploration du monde

-   Déplacement avec les flèches directionnelles ou ZQSD.
-   Déplacement case par case.
-   Collisions avec les éléments non traversables.
-   Carte du monde avec caméra qui suit le joueur.
-   Affichage de la zone actuelle.
-   Plusieurs biomes et environnements.
-   Maisons, bâtiments, zones d'herbes et PNJ.
-   Entrées et sorties des bâtiments et arènes.

### Biomes

-   🏘️ Bourg Palette
-   🌊 Lac Azur
-   🌲 Forêt Sombre
-   🏜️ Route / zone sablonneuse
-   🌋 Zone Volcanique
-   ❄️ Zone Arctique

Chaque zone possède ses propres créatures sauvages et une plage de
niveaux adaptée à la progression.

## 🏥 3. Centre Fakemon

-   Centre accessible depuis le monde.
-   Infirmière PNJ.
-   Interaction avec la touche **E**.
-   Dialogue.
-   Soin gratuit de toute l'équipe.
-   Restauration des PV au maximum.
-   Remise en état des créatures K.O.
-   Sauvegarde de l'état après le soin.
-   PC de gestion de l'équipe et du stockage.

## 🖥️ 4. PC et stockage

-   Équipe limitée à **6 créatures**.
-   Affichage de l'équipe.
-   Gestion de la créature active.
-   Stockage des créatures supplémentaires.
-   Déplacement d'une créature entre équipe et stockage.
-   Conservation des créatures stockées dans la sauvegarde.

## 📖 5. Pokédex

Le Pokédex suit séparément les espèces :

-   👁️ **Vues** : déjà rencontrées.
-   🔴 **Capturées** : déjà capturées.

Il affiche la progression du joueur et la liste des espèces. Le statut
peut aussi être affiché pendant les combats à côté du nom de la
créature.

## 🌿 6. Rencontres sauvages

Dans les zones de rencontre :

1.  Une rencontre aléatoire peut se déclencher.
2.  Une créature sauvage apparaît avec un niveau dépendant de la zone.
3.  Elle est automatiquement enregistrée comme vue dans le Pokédex.
4.  Le joueur peut **combattre** ou **fuir**.

Le Plateau des Légendes possède une table de rencontres spéciale
permettant de rencontrer toutes les espèces sauvages à des niveaux
élevés.

## ⚔️ 7. Combats au tour par tour

Actions disponibles :

-   ⚔️ Attaquer.
-   🔴 Capturer pendant un combat sauvage.
-   💊 Utiliser une Potion.
-   🏃 Fuir pendant un combat sauvage.
-   🔄 Changer de créature lorsqu'une créature est K.O.

L'interface affiche le sprite, nom, niveau, type, PV, barre de PV,
journal du combat et actions disponibles.

Les combats contre les dresseurs ne permettent ni capture ni fuite.

## 🧠 8. Types et attaques

Les créatures disposent d'attaques avec un type et une puissance. Le
système calcule :

-   Attaque.
-   Défense.
-   Puissance du mouvement.
-   Variation aléatoire des dégâts.
-   Multiplicateur selon les types.
-   Messages d'efficacité.

Le menu des attaques indique également le type et l'efficacité prévue
contre l'adversaire.

## 📈 9. XP et niveaux

Les combats rapportent de l'expérience.

Une montée de niveau augmente notamment :

-   PV maximum.
-   PV.
-   Attaque.
-   Défense.
-   Vitesse.

Le système peut enchaîner plusieurs montées de niveau si suffisamment
d'XP a été accumulée.

## ✨ 10. Évolutions

Certaines créatures évoluent lorsqu'elles atteignent le niveau requis.

L'évolution peut modifier :

-   ID de l'espèce.
-   Nom.
-   Sprite.
-   PV maximum.
-   Attaque.
-   Défense.
-   Vitesse.

Les espèces obtenues uniquement par évolution ne sont pas directement
rencontrées à l'état sauvage.

## 🔴 11. Capture

Les créatures sauvages peuvent être capturées avec des **Sphères de
Capture**.

La chance de capture dépend notamment des PV restants et du niveau de la
créature.

Après réussite :

-   La créature rejoint l'équipe si elle n'est pas pleine.
-   Sinon elle est envoyée au stockage.
-   Elle est ajoutée au Pokédex des capturées.
-   Le joueur reçoit de l'argent.

## 💊 12. Inventaire et objets

L'inventaire peut contenir notamment :

-   💊 Potions.
-   🔴 Sphères de Capture.
-   Objets reçus ou achetés.

### Potions

-   Restaurent jusqu'à 20 PV.
-   Sont consommées après utilisation.
-   Peuvent être utilisées hors combat.
-   Peuvent être utilisées en combat.
-   En combat, l'adversaire peut attaquer après l'utilisation.

## 🛒 13. Boutique

La boutique permet d'acheter les objets disponibles avec l'argent du
joueur.

Elle affiche :

-   Icône.
-   Nom.
-   Description.
-   Quantité possédée.
-   Prix.
-   Argent disponible.

Un achat impossible faute d'argent est refusé et les achats sont
sauvegardés.

## 💰 14. Argent

Le joueur possède une monnaie, initialisée à **300** dans une nouvelle
partie.

L'argent peut être gagné grâce aux combats, captures et récompenses,
puis dépensé dans la boutique.

## 🧑‍🤝‍🧑 15. PNJ et dialogues

Le monde comporte plusieurs types de PNJ :

-   PNJ de dialogue.
-   Dresseurs.
-   PNJ donnant des objets.
-   Infirmière du Centre Fakemon.
-   PNJ ouvrant la boutique.
-   Maîtres d'arène.
-   Maître Pokémon final.

L'interaction se fait en faisant face au PNJ puis en appuyant sur **E**.

Les dialogues peuvent comporter plusieurs lignes et des conséquences
selon le type du PNJ.

## 🎁 16. Cadeaux des PNJ

Certains PNJ donnent des objets. Le jeu mémorise les cadeaux déjà reçus
afin d'empêcher de recevoir indéfiniment le même cadeau.

## 🏟️ 17. Arènes

Il existe plusieurs arènes, une par biome de progression.

Chaque maître possède :

-   Nom.
-   Thème / couleur / icône.
-   Équipe de créatures.
-   Dialogue.
-   Réplique après défaite.
-   Récompense.
-   Badge.

Les arènes sont progressives : un maître peut refuser le combat tant que
le maître précédent n'a pas été vaincu.

Après une victoire :

-   Le maître est enregistré comme vaincu.
-   La récompense est donnée.
-   Le badge est remporté.
-   La progression est sauvegardée.

## 🥊 18. Dresseurs

Les dresseurs du monde peuvent déclencher des combats.

-   Ils peuvent posséder plusieurs créatures.
-   Les créatures adverses sont envoyées une par une.
-   Le combat continue jusqu'à la défaite de toute l'équipe adverse.
-   Le joueur gagne de l'expérience et de l'argent.
-   Le dresseur peut être enregistré comme vaincu.

## 🏔️ 19. Plateau des Légendes --- postgame

Après la victoire contre la dernière arène, un passage scellé devient
accessible et mène au **🏔️ Plateau des Légendes**.

La zone comprend :

-   Nouvelle carte.
-   Petite ville.
-   Centre Fakemon.
-   Maisons.
-   Immense arène finale.
-   Plusieurs zones d'herbes.
-   Toutes les espèces sauvages disponibles dans le jeu.
-   Rencontres à des niveaux élevés, environ **27 à 32**.

## 👑 20. Maître Pokémon

Le Plateau des Légendes contient une immense arène finale avec **Maître
Orion**.

Son équipe utilise les formes finales des trois créatures de départ :

-   Niveau 38.
-   Niveau 38.
-   Niveau 40.

La victoire donne une récompense importante et le **Badge Suprême**.

## ⚔️ 21. PvP en ligne

Avec Supabase configuré, deux joueurs peuvent s'affronter en ligne.

### Recherche automatique

-   Lancer une recherche.
-   Entrer dans une file d'attente.
-   Trouver automatiquement un autre joueur.
-   Démarrer le combat automatiquement.

La file possède une durée maximale prise en compte pour éviter de
conserver indéfiniment les recherches anciennes.

### Combat par code

-   Créer une partie.
-   Obtenir un code à 6 caractères.
-   Donner le code à l'autre joueur.
-   L'autre joueur rejoint la partie.

Le combat est synchronisé en temps réel via Supabase.

## 🌐 22. Synchronisation PvP

Le système PvP utilise :

-   Table de parties.
-   File de matchmaking.
-   Synchronisation temps réel.
-   Équipes envoyées sous forme de snapshots indépendants.
-   Synchronisation des actions et des tours.
-   Protection contre la double résolution d'un même tour.

Les combats PvP utilisent une équipe temporairement soignée pour le
combat afin de ne pas modifier directement les PV de l'équipe
d'exploration.

## 🔁 23. Échanges entre joueurs

Le jeu propose un échange en ligne avec Supabase.

Un joueur peut :

1.  Créer un échange.
2.  Générer un code.
3.  Donner le code à un autre joueur.
4.  Choisir une créature de son équipe ou de son stockage.
5.  Voir la proposition adverse.
6.  Confirmer l'échange.

Lorsque les deux joueurs ont confirmé, chacun reçoit la créature de
l'autre et perd celle qu'il a donnée.

## 👤 24. Comptes joueurs

Avec Supabase configuré :

-   Création de compte.
-   Connexion.
-   Déconnexion.
-   Pseudo unique.
-   Mot de passe.
-   Gestion de session.

Le compte sert notamment à identifier correctement les joueurs pour les
fonctionnalités en ligne.

## 💾 25. Sauvegarde

La partie est sauvegardée automatiquement avec `localStorage`.

Sont notamment conservés :

-   Pseudo.
-   Équipe.
-   Stockage.
-   Créature active.
-   Inventaire.
-   Argent.
-   Pokédex.
-   Cadeaux reçus.
-   Dresseurs vaincus.
-   Progression.
-   Position / état de la partie selon les données prises en charge.

Avec un compte Supabase, chaque compte possède sa propre clé de
sauvegarde locale.

Le jeu contient également des mécanismes de migration pour certaines
anciennes sauvegardes.

## 🖼️ 26. Interface

L'interface principale affiche notamment :

-   👤 Pseudo.
-   💰 Argent.
-   📖 Pokédex.
-   ⚔️ PvP.
-   🔁 Échange.
-   🔓 Déconnexion.
-   👥 Équipe.
-   🗺️ Zone actuelle.
-   Canvas de jeu.
-   Rappels des commandes.

Les écrans de combat affichent les créatures, leurs PV, niveaux, types,
sprites, journal et actions.

## 🎨 27. Rendu visuel

Le jeu utilise un rendu 2D sur Canvas avec :

-   Tuiles de terrain.
-   Décors.
-   Maisons.
-   Centre Fakemon.
-   Arènes.
-   PNJ.
-   Joueur.
-   Ombres et effets visuels.
-   Animations légères.
-   Effets de lumière / vignette / finition d'écran.

## 🔄 Boucle de jeu

``` text
Créer / connecter son compte
        ↓
Choisir sa créature de départ
        ↓
Explorer le monde
        ↓
Rencontrer des créatures sauvages
        ↓
Combattre
        ↓
Capturer / gagner de l'XP / gagner de l'argent
        ↓
Faire évoluer son équipe
        ↓
Soigner au Centre Fakemon
        ↓
Gérer l'équipe avec le PC
        ↓
Compléter le Pokédex
        ↓
Acheter des objets
        ↓
Affronter les arènes
        ↓
Obtenir les badges
        ↓
Débloquer le Plateau des Légendes
        ↓
Affronter le Maître Pokémon
        ↓
Continuer à capturer et entraîner
        ↓
Jouer en PvP / échanger avec d'autres joueurs
```

## 🏆 Objectifs possibles

-   Construire une équipe de 6 créatures.
-   Capturer les espèces disponibles.
-   Compléter le Pokédex.
-   Faire évoluer les créatures.
-   Monter ses créatures en niveau.
-   Battre les dresseurs.
-   Obtenir les badges.
-   Débloquer le Plateau des Légendes.
-   Battre le Maître Pokémon.
-   Accumuler de l'argent et acheter des objets.
-   Optimiser une équipe selon les types.
-   Affronter d'autres joueurs en PvP.
-   Échanger des créatures avec d'autres joueurs.

## 🧩 Technologies

-   HTML
-   CSS
-   JavaScript
-   Canvas 2D
-   `localStorage`
-   Supabase Auth
-   Supabase Database
-   Supabase Realtime

## 📌 Tableau récapitulatif

  Fonctionnalité          État
  ----------------------- ------------------
  Exploration             ✅
  Carte du monde          ✅
  Biomes                  ✅
  Créatures sauvages      ✅
  Rencontres aléatoires   ✅
  Combats sauvages        ✅
  Capture                 ✅
  XP / niveaux            ✅
  Évolutions              ✅
  Types / efficacité      ✅
  Potions                 ✅
  Inventaire              ✅
  Boutique                ✅
  Argent                  ✅
  PNJ / dialogues         ✅
  Cadeaux PNJ             ✅
  Centre Fakemon          ✅
  Soins                   ✅
  PC / stockage           ✅
  Équipe de 6             ✅
  Pokédex                 ✅
  Arènes                  ✅
  Badges                  ✅
  Dresseurs               ✅
  Plateau des Légendes    ✅
  Maître Pokémon          ✅
  Compte joueur           ✅ avec Supabase
  Sauvegarde locale       ✅
  PvP en ligne            ✅ avec Supabase
  Matchmaking PvP         ✅
  PvP par code            ✅
  Échange en ligne        ✅ avec Supabase
  Échange par code        ✅