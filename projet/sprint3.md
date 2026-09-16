# Sprint 3 – Projet Pokémon-like

Ce document couvre les user stories **US03 à US17** du backlog (`user_stories.md`), suivies sur GitHub via les issues [#5](https://github.com/LucasChaudet1/Projet-pokemon-like/issues/5) à [#21](https://github.com/LucasChaudet1/Projet-pokemon-like/issues/21) (et leurs sous-issues [#24](https://github.com/LucasChaudet1/Projet-pokemon-like/issues/24)-[#28](https://github.com/LucasChaudet1/Projet-pokemon-like/issues/28) pour l'US12).

---

## 🎯 Sprint Goal

Transformer la démo de Sprint 2 (rencontres, combat, capture) en une véritable boucle de jeu de dresseur : le joueur doit pouvoir **gérer son équipe et sa collection** (répertoire, stockage, organisation), **faire progresser ses créatures** (expérience, montée de niveau, évolution) et **s'équiper entre deux combats** (boutique, soins, centre de soin), le tout en pouvant **reprendre sa partie** grâce à la sauvegarde.

---

## 📋 Sprint Backlog

| US | User Story | Priorité | Issue GitHub | Assigné(e) | Statut |
|----|---|---|---|---|---|
| US03 | Interagir avec les PNJ (dialogue, objet, combat) | Moyenne | #5 | Lucas | ✅ Terminé |
| US04 | Lancer une sphère de capture sur une créature sauvage | Haute | #6 | NeiLP14 | ✅ Terminé |
| US05 | Probabilité de capture dépendante des PV et du niveau | Haute | #7 | Lucas | ✅ Terminé |
| US06 | Combat au tour par tour contre une créature sauvage | Haute | #8 | Geo6453, Lucas | ✅ Terminé |
| US07 | Combat contre un dresseur PNJ | Haute | #9 | NeiLP14 | ❌ Non terminé (reporté) |
| US08 | Sélectionner une attaque parmi celles connues | Haute | #10 | Geo6453 | ✅ Terminé |
| US09 | Répertoire des créatures rencontrées/capturées (Pokédex) | Moyenne | #11 | Lucas | ✅ Terminé |
| US10 | Organiser une équipe de 6 créatures maximum | Haute | #12 | NeiLP14 | ✅ Terminé |
| US11 | Stocker les créatures hors équipe active (PC) | Moyenne | #13 | NeiLP14 | ✅ Terminé |
| US12 | Gagner de l'expérience après un combat gagné | Haute | #14 (+ #24-28) | Geo6453 | ✅ Terminé |
| US13 | Évolution des créatures à un niveau donné | Moyenne | #15 | NeiLP14 (assignée) / livrée par Lucas | ✅ Terminé |
| US14 | Acheter des objets dans une boutique | Haute | #16 | Non assignée / livrée par Lucas | ✅ Terminé |
| US15 | Utiliser un objet de soin en combat | Moyenne | #17, #18 (doublon) | NeiLP14 | ✅ Terminé |
| US16 | Soigner gratuitement l'équipe au centre de soin | Moyenne | #19, #20 (doublon) | NeiLP14 | ✅ Terminé |
| US17 | Sauvegarder et reprendre sa progression | Critique | #21 | NeiLP14 | ✅ Terminé |

📊 **Statut : 14/15 user stories terminées (93 %)**

---

## 👥 Qui a fait quoi

**Lucas (LucasChaudet1)**
- US03 – Interactions PNJ (#5)
- US05 – Probabilité de capture (#7)
- US06 – Combat sauvage, en binôme avec Geo6453 (#8)
- US09 – Répertoire / Pokédex (#11)
- US13 – Évolution des créatures (#15)
- US14 – Boutique (#16)
- Travail hors backlog officiel : ajout de nouvelles zones et de zones de rencontre supplémentaires sur la carte.
- Clôture manuelle de plusieurs issues déjà livrées par d'autres membres (#4, #6, #10, #14, #20) lors du nettoyage de fin de sprint.

**NeiLP14**
- US04 – Capture par sphère (#6)
- US10 – Organisation de l'équipe (#12)
- US11 – Stockage / PC des créatures (#13)
- US15 – Soin en combat (#17/#18)
- US16 – Centre de soin (#19/#20)
- US17 – Sauvegarde de la progression (#21)
- Décision de retirer la section « ordre de développement » du document `user_stories.md`.

**Geo6453**
- US08 – Sélection et utilisation d'une attaque (#10)
- US12 – Gain d'expérience, découpée en 5 sous-issues détaillées (#24 à #28 : XP même sans combattre, XP proportionnelle au niveau adverse, message de montée de niveau, augmentation automatique des statistiques, résumé d'XP en fin de combat).
- Co-réalisation du combat sauvage (#8) avec Lucas.

**US07 (combat contre un dresseur PNJ)** reste assignée à NeiLP14 mais n'a pas été livrée sur ce sprint.

---

## ✅ Tâches terminées

- US03, US04, US05, US06, US08, US09, US10, US11, US12, US13, US14, US15, US16, US17 — soit **14 user stories sur 15**.
- Le Pokédex, le PC de stockage, la boutique, le centre de soin et la sauvegarde forment désormais un cycle de jeu complet entre deux explorations.
- L'évolution des créatures (US13) a été le dernier élément livré, en toute fin de sprint.

## ❌ Tâches non terminées

- **US07 — Combat contre un dresseur PNJ** (issue [#9](https://github.com/LucasChaudet1/Projet-pokemon-like/issues/9), toujours ouverte). Le code contient d'ailleurs un message explicite prévenant le joueur : *« Les combats de dresseurs arriveront dans une prochaine mise à jour ! »* (`game.js:1631`). La fonctionnalité est reportée au sprint suivant plutôt que livrée à moitié.

---

## ⚠️ Problèmes rencontrés

- **Doublons d'issues GitHub** : US15 (#17/#18) et US16 (#19/#20) ont chacune été créées deux fois. Une des deux copies (#19) est restée ouverte par erreur alors que la fonctionnalité correspondante (#20) était bien terminée et fermée, ce qui a brouillé la lecture du burndown en fin de sprint.
- **Documentation de planification désynchronisée** : le backlog annoncé dans `sprint2.md` pour le Sprint 3 (#9, #10, #11, #12, #14, #15) ne correspond pas au périmètre réellement suivi sur GitHub pour ces mêmes numéros d'issues. Le fichier de planification n'avait pas été mis à jour au fil de l'avancement réel du projet.
- **Aucun jalon (milestone) « sprint3 »** n'existe sur GitHub — seuls `sprint1` et `sprint2` ont été créés. Les issues #19 à #28 ne sont rattachées à aucun jalon, ce qui a rendu le périmètre du sprint moins visible directement dans l'outil.
- **Écart entre assignation et livraison réelle** : plusieurs user stories ont été assignées à une personne mais finalement codées par une autre (ex. US13 assignée à NeiLP14, livrée par Lucas ; US14 livrée sans assignation), signe d'un manque de synchronisation sur la répartition du travail en cours de sprint.

## 🧭 Décisions prises pendant le sprint

- Retirer la section « ordre de développement » du document `user_stories.md` pour laisser plus de souplesse dans l'organisation des tâches au fil du sprint.
- Étendre la carte avec de nouvelles zones et de nouvelles zones de rencontre en parallèle du backlog officiel, pour enrichir l'exploration.
- Conserver le même type élémentaire entre les différentes formes d'évolution d'une créature (plutôt que d'introduire un nouveau type par palier) afin de ne pas complexifier le système d'attaques (`MOVE_POOL`).
- Reporter explicitement le combat contre les dresseurs PNJ (US07) à une prochaine itération plutôt que de livrer une version incomplète, avec un message d'information affiché au joueur en attendant.

---

## 🗓️ Comptes rendus de Daily Scrum

Le sprint s'est déroulé sur une session de travail intensive le **16/09/2026** (~7h, de 09h16 à 14h43), à la suite de la mise en place du projet et du Sprint 1/2 la veille. Deux points d'équipe ont rythmé la journée.

### Daily #1 — matin (09h00)

| Membre | Hier | Aujourd'hui | Blocages |
|---|---|---|---|
| NeiLP14 | Mise en place des user stories et de la doc Sprint 1 | Nettoyage du backlog, gestion d'équipe (US10), stockage/PC (US11), centre Fakemon (US16) | Aucun |
| Lucas | Choix créature de départ, déplacement sur la carte | Rencontres sauvages (US03 PNJ, US05 capture, US06 combat) | Aucun |
| Geo6453 | Ajout des sprites et de la liste des noms | Système d'attaques (US08), découpage du système d'XP (US12) | Doit se coordonner avec Lucas sur le combat sauvage (US06) |

### Daily #2 — après-midi (12h15)

| Membre | Depuis ce matin | Reste à faire | Blocages |
|---|---|---|---|
| NeiLP14 | US10, US11, US15 (soin en combat), US16 livrés | US17 (sauvegarde) à vérifier / fermer | Doublons d'issues #17/#18 et #19/#20 à nettoyer |
| Lucas | US03, US05, US06 livrés, ajout de nouvelles zones | US09 (Pokédex), US14 (boutique), US13 (évolution) | US07 (dresseurs) ne sera pas prêt à temps → à reporter |
| Geo6453 | US08 et sous-issues XP (US12) livrés | Rien — travail terminé pour ce sprint | Aucun |

---

## 🔍 Sprint Review

**Démontré à l'issue du sprint :**
- Un joueur peut dialoguer avec un PNJ, capturer une créature sauvage avec une sphère dont la réussite dépend des PV et du niveau, et la combattre au tour par tour en choisissant une attaque.
- Chaque créature ayant participé à une victoire gagne de l'expérience proportionnelle au niveau adverse (+10 XP/niveau), monte de niveau avec un message dédié, voit ses statistiques augmenter, et peut désormais **évoluer** (changement de nom, d'apparence et bonus de statistiques) à un niveau donné.
- L'équipe (6 créatures max) peut être organisée, et les créatures surnuméraires stockées dans un PC consultable.
- Le Pokédex liste les créatures vues/capturées avec leurs informations.
- Une boutique permet d'acheter des objets de soin, utilisables aussi bien en combat qu'au centre de soin (gratuit, pour toute l'équipe).
- La progression (équipe, inventaire, position, Pokédex) est sauvegardée et rechargée automatiquement.

**Non démontré :** le combat contre un dresseur PNJ (US07) — le joueur en est informé en jeu et la fonctionnalité est planifiée pour le sprint suivant.

**Bilan :** l'objectif du sprint est atteint à 93 % (14/15 US). La boucle de jeu « explorer → combattre → progresser → s'équiper → sauvegarder » est désormais complète et jouable de bout en bout.

---

## 🔁 Sprint Retrospective (Keep / Drop / Try)

### ✅ Keep
- La rédaction des user stories avec critères d'acceptation clairs (`user_stories.md`), qui a facilité la vérification de ce qui était réellement terminé.
- L'utilisation des commits `fix #N` pour lier automatiquement le code aux issues GitHub et les fermer.
- La répartition du travail par domaine de compétence : Geo6453 sur les mécaniques de combat/XP, NeiLP14 sur la gestion d'équipe/PC/centre de soin, Lucas sur l'exploration/rencontres/Pokédex.

### 🗑️ Drop
- La création d'issues en double (#17/#18, #19/#20), source de confusion sur ce qui restait réellement à faire en fin de sprint.
- Laisser les documents de planification (`sprint2.md`) obsolètes par rapport au travail réellement suivi sur GitHub.

### 🧪 Try
- Créer systématiquement un jalon (milestone) GitHub dès le lancement d'un sprint, pour y rattacher toutes les issues et fiabiliser le suivi du périmètre.
- Tenir `project_backlog.md` à jour au fil de l'eau plutôt que de le laisser vide.
- Prioriser plus tôt dans le sprint les user stories à risque (comme US07, restée seule non terminée) pour éviter qu'elles ne se retrouvent en fin de planning.
