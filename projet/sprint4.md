# 🟣 Sprint 4 – Projet Pokémon-like

## 🎯 Sprint Goal

L'objectif du Sprint 4 est de finaliser les dernières fonctionnalités du projet en ajoutant les **interactions entre joueurs**.

Ce sprint se concentre principalement sur :

- les combats entre joueurs ;
- les échanges de créatures entre joueurs ;
- la vérification de la fonctionnalité de soin gratuit dans un centre de soin.

---

## 📋 Sprint Backlog

| Issue | User Story | Priorité | Statut |
|---|---|---|---|
| #23 | En tant que joueur, je veux affronter un autre joueur en combat afin de tester ma stratégie contre un adversaire humain. | Haute | ❌ À faire |
| #22 | En tant que joueur, je veux échanger une créature avec un autre joueur afin de compléter mon répertoire de créatures. | Haute | ❌ À faire |
| #19 | En tant que joueur, je veux soigner gratuitement toute mon équipe dans un centre de soin afin de repartir à l'aventure en pleine forme. | Moyenne | ⚠️ À vérifier |

---

# 🥊 US — Combat entre joueurs

### Issue #23

> **En tant que joueur, je veux affronter un autre joueur en combat afin de tester ma stratégie contre un adversaire humain.**

### 🎯 Objectif

Permettre à deux joueurs de s'affronter dans un combat afin de tester leur équipe et leur stratégie contre un adversaire humain.

### Fonctionnalités attendues

Le joueur doit pouvoir :

- sélectionner un autre joueur ;
- proposer un combat ;
- accepter ou refuser un combat ;
- sélectionner sa créature ;
- effectuer des attaques ;
- attendre et recevoir les actions de l'adversaire ;
- continuer le combat jusqu'à la victoire d'un des deux joueurs ;
- afficher le résultat du combat.

### Critères d'acceptation

- [ ] Un joueur peut sélectionner un autre joueur.
- [ ] Un joueur peut proposer un combat.
- [ ] L'autre joueur peut accepter ou refuser.
- [ ] Le combat démarre lorsque les deux joueurs ont accepté.
- [ ] Chaque joueur possède sa propre équipe.
- [ ] Les joueurs peuvent effectuer leurs actions pendant le combat.
- [ ] Les dégâts sont correctement appliqués.
- [ ] Le combat se termine lorsqu'un joueur n'a plus de créature utilisable.
- [ ] Le vainqueur et le perdant sont clairement affichés.

---

# 🔄 US — Échange entre joueurs

### Issue #22

> **En tant que joueur, je veux échanger une créature avec un autre joueur afin de compléter mon répertoire de créatures.**

### 🎯 Objectif

Permettre aux joueurs d'échanger leurs créatures afin de compléter leur collection.

### Fonctionnalités attendues

Le joueur doit pouvoir :

- sélectionner un autre joueur ;
- sélectionner une créature à échanger ;
- proposer un échange ;
- recevoir une proposition d'échange ;
- accepter ou refuser l'échange ;
- récupérer la créature proposée par l'autre joueur lorsque l'échange est accepté.

### Critères d'acceptation

- [ ] Un joueur peut sélectionner un autre joueur.
- [ ] Un joueur peut sélectionner une créature de son équipe ou de son stockage.
- [ ] Une proposition d'échange peut être envoyée.
- [ ] L'autre joueur peut accepter ou refuser.
- [ ] Les deux joueurs doivent valider l'échange.
- [ ] Les créatures sont correctement transférées après validation.
- [ ] Une créature ne peut pas être perdue pendant l'échange.
- [ ] Une créature ne peut pas être dupliquée.
- [ ] Les équipes et les stockages sont correctement mis à jour.

---

# 🏥 US — Soin gratuit au centre

### Issue #19

> **En tant que joueur, je veux soigner gratuitement toute mon équipe dans un centre de soin afin de repartir à l'aventure en pleine forme.**

### 🎯 État de la fonctionnalité

Cette fonctionnalité a déjà été implémentée dans le Sprint 3 avec le système de centre de soin.

Le joueur peut entrer dans le centre et son équipe est soignée gratuitement.

### Vérifications à effectuer

- [ ] Vérifier que toutes les créatures de l'équipe récupèrent leurs PV.
- [ ] Vérifier que les créatures K.O. sont correctement soignées.
- [ ] Vérifier que le soin est gratuit.
- [ ] Vérifier que l'équipe reste correctement enregistrée après le soin.
- [ ] Vérifier que le joueur peut repartir à l'aventure après le soin.

### Gestion de l'issue

Si tous les tests sont validés, l'issue **#19 pourra être fermée comme déjà implémentée / doublon de la fonctionnalité réalisée dans le Sprint 3**.

---

# 🛠️ Organisation du Sprint

Le développement sera organisé autour de deux fonctionnalités principales :

### 1. Interaction entre joueurs

Développement des systèmes nécessaires pour permettre :

- la recherche/sélection d'un joueur ;
- les demandes ;
- l'acceptation ou le refus ;
- la communication entre les deux joueurs.

### 2. Combat et échange

Une fois l'interaction entre joueurs fonctionnelle :

- mise en place du combat PvP ;
- mise en place du système d'échange ;
- vérification des données des équipes ;
- gestion des résultats.

### 3. Tests et finalisation

- tests du centre de soin ;
- tests des combats ;
- tests des échanges ;
- correction des bugs ;
- fermeture des issues terminées.

---

# ⚠️ Points de vigilance

## Combat PvP

Le système doit permettre aux deux joueurs d'avoir une vision cohérente du combat.

Il faudra notamment vérifier :

- la synchronisation des actions ;
- les PV ;
- les tours ;
- les attaques ;
- la victoire et la défaite.

## Échange

Une attention particulière devra être portée à la sécurité des échanges.

Il faut éviter :

- la perte d'une créature ;
- la duplication d'une créature ;
- l'échange d'une créature qui n'est plus disponible ;
- les échanges effectués sans validation des deux joueurs.

---

# 🧪 Tests

Les fonctionnalités seront testées avec plusieurs scénarios.

### Combat

- [ ] Joueur A propose un combat à Joueur B.
- [ ] Joueur B accepte.
- [ ] Le combat démarre.
- [ ] Les deux joueurs effectuent des actions.
- [ ] Une créature est mise K.O.
- [ ] Le combat se poursuit avec les créatures restantes.
- [ ] Le résultat final est affiché.

### Échange

- [ ] Joueur A propose une créature.
- [ ] Joueur B reçoit la proposition.
- [ ] Joueur B accepte.
- [ ] Les deux créatures sont échangées.
- [ ] Les équipes/stockages sont correctement mis à jour.
- [ ] Aucune créature n'est perdue ou dupliquée.

### Centre de soin

- [ ] Une équipe blessée entre dans le centre.
- [ ] Toutes les créatures sont soignées.
- [ ] Aucun objet ou argent n'est consommé.
- [ ] L'équipe est sauvegardée correctement.

---

# 🔍 Sprint Review

À la fin du Sprint 4, les fonctionnalités suivantes devront être présentées :

- un joueur peut affronter un autre joueur ;
- le combat PvP fonctionne jusqu'à la victoire d'un joueur ;
- un joueur peut proposer un échange ;
- un autre joueur peut accepter ou refuser ;
- les créatures sont correctement échangées ;
- le centre de soin soigne gratuitement toute l'équipe ;
- les issues correspondantes peuvent être fermées lorsque les critères d'acceptation sont validés.

---

# 🔁 Sprint Retrospective

## ✅ Keep

- Utilisation des issues GitHub pour suivre les fonctionnalités.
- Développement par user stories.
- Tests réguliers des fonctionnalités.
- Réutilisation du système de combat déjà développé.

## 🗑️ Drop

- Les issues en doublon.
- Le développement de fonctionnalités sans critères d'acceptation clairement définis.
- Les fonctionnalités non testées avant la fin du sprint.

## 🧪 Try

- Tester les fonctionnalités avec deux joueurs dès les premières versions.
- Tester les échanges avec différentes compositions d'équipe.
- Tester les cas particuliers avant la validation finale.
- Fermer les issues dès que les critères d'acceptation sont remplis.

---

# 🏁 Objectif de fin de Sprint

À la fin du Sprint 4, les dernières fonctionnalités importantes du projet devront être finalisées.

Le joueur devra pouvoir :

**Explorer → Capturer → Entraîner → Constituer son équipe → Soigner son équipe → Combattre → Affronter un autre joueur → Échanger des créatures avec d'autres joueurs**

L'objectif final est ainsi de disposer d'une version du jeu intégrant les principales fonctionnalités prévues dans le projet.