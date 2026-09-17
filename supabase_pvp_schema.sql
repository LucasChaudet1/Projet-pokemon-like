-- Schéma Supabase pour le combat PvP (US19 — Combat entre joueurs)
--
-- Comment l'utiliser :
-- 1. Dans le dashboard Supabase de ton projet, ouvre l'onglet "SQL Editor".
-- 2. Colle tout ce fichier et clique sur "Run".
-- 3. C'est tout : la dernière instruction active le temps réel sur la
--    table, tu n'as rien d'autre à activer manuellement.
--
-- ⚠️ Sécurité : ce jeu n'a pas de système d'authentification (pas de
-- compte/mot de passe joueur), donc les règles RLS ci-dessous autorisent
-- n'importe qui possédant la clé "anon" (publique par nature) à lire et
-- écrire n'importe quelle partie. C'est très bien pour un projet scolaire
-- ou pour jouer entre amis, mais ce ne serait pas suffisant pour une mise
-- en production publique (il faudrait ajouter Supabase Auth et restreindre
-- chaque ligne à ses deux joueurs).

create table if not exists pvp_matches (
    code text primary key,
    status text not null default 'waiting', -- waiting | active | finished

    player1_pseudo text,
    player2_pseudo text,

    player1_team jsonb,
    player2_team jsonb,

    player1_active integer not null default 0,
    player2_active integer not null default 0,

    player1_pending text not null default 'move', -- move | switch
    player2_pending text not null default 'move',

    player1_move jsonb,
    player2_move jsonb,

    turn integer not null default 1,
    log jsonb not null default '[]'::jsonb,

    winner text, -- player1 | player2 | draw

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table pvp_matches enable row level security;

drop policy if exists "Lecture publique des parties" on pvp_matches;
create policy "Lecture publique des parties" on pvp_matches
    for select using (true);

drop policy if exists "Creation publique de parties" on pvp_matches;
create policy "Creation publique de parties" on pvp_matches
    for insert with check (true);

drop policy if exists "Mise a jour publique des parties" on pvp_matches;
create policy "Mise a jour publique des parties" on pvp_matches
    for update using (true);

drop policy if exists "Suppression publique des parties" on pvp_matches;
create policy "Suppression publique des parties" on pvp_matches
    for delete using (true);

-- Active la réplication temps réel (Realtime) pour cette table.
-- Si tu obtiens une erreur du type "already member of publication", c'est
-- normal (ça veut dire que c'est déjà activé) : ignore-la simplement.
alter publication supabase_realtime add table pvp_matches;
