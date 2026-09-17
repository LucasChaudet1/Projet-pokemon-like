// Configuration Supabase — nécessaire pour le combat en ligne (PvP) et pour
// le compte joueur (pseudo + mot de passe)
//
// Le reste du jeu fonctionne sans backend (localStorage). Le PvP a besoin
// d'un point de rendez-vous partagé entre les deux joueurs, et le compte
// joueur a besoin d'un endroit pour vérifier les mots de passe : c'est le
// rôle de Supabase ici (base Postgres + authentification + temps réel,
// gratuit).
//
// Marche à suivre (5 minutes) :
//
// 1. Crée un compte gratuit sur https://supabase.com puis "New project"
//    (choisis un mot de passe de base de données, note-le, tu n'en auras
//    pas besoin ici mais Supabase le demande).
// 2. Attends que le projet soit prêt (~2 min), puis va dans
//    Project Settings > API.
// 3. Copie "Project URL" dans SUPABASE_URL ci-dessous.
// 4. Copie la clé "anon public" (PAS la clé "service_role", qui est secrète)
//    dans SUPABASE_ANON_KEY ci-dessous.
// 5. Ouvre l'onglet "SQL Editor" du projet Supabase, colle le contenu du
//    fichier supabase_pvp_schema.sql (à la racine de ce dépôt) et clique
//    sur "Run". Ça crée la table pvp_matches et active le temps réel dessus.
// 6. Pour le compte joueur : va dans Authentication > Providers > Email et
//    DÉSACTIVE "Confirm email". Le jeu n'utilise pas de vraie adresse e-mail
//    (juste un pseudo + mot de passe), donc aucun e-mail de confirmation ne
//    pourrait jamais être reçu — sans cette étape, personne ne pourrait
//    jamais se connecter après avoir créé son compte.
// 7. Recharge la page du jeu : l'écran d'accueil demande maintenant un
//    pseudo + mot de passe, et le bouton "⚔️ PvP" devient utilisable.

const SUPABASE_URL = "https://mwhfuygkcrjjgvzlxabb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13aGZ1eWdrY3Jqamd2emx4YWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2MjU2NjYsImV4cCI6MjEwNTIwMTY2Nn0.Kjp0fNli-eaZ4HPg3vq8LaPAby6PCXzfgcZH2MQaTis";
