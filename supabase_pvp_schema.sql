-- Schéma Supabase pour le combat PvP (US19 — Combat entre joueurs)
--
-- Comment l'utiliser :
-- 1. Dans le dashboard Supabase de ton projet, ouvre l'onglet "SQL Editor".
-- 2. Colle tout ce fichier et clique sur "Run" (le script peut être relancé
--    sans risque si tu l'as déjà exécuté une fois : "create table if not
--    exists", "drop policy if exists" et les blocs "do $$ ... $$" pour le
--    temps réel le rendent entièrement rejouable, sans aucune erreur).
-- 3. C'est tout : les dernières instructions activent le temps réel sur les
--    tables, tu n'as rien d'autre à activer manuellement.
--
-- ⚠️ Sécurité : les mots de passe des joueurs sont gérés par Supabase Auth
-- (hachés, jamais stockés en clair), mais les tables ci-dessous restent
-- lisibles/écrivables par n'importe qui possédant la clé "anon" (publique
-- par nature), connecté ou non. C'est très bien pour un projet scolaire ou
-- pour jouer entre amis, mais ce ne serait pas suffisant pour une mise en
-- production publique (il faudrait restreindre chaque ligne aux deux
-- joueurs concernés via auth.uid()).

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

-- Active la réplication temps réel (Realtime) pour cette table, seulement
-- si elle n'y est pas déjà (contrairement à "create table if not exists",
-- "alter publication ... add table" échoue si on le relance sur une table
-- déjà ajoutée : ce bloc évite l'erreur en le vérifiant d'abord).
do $$
begin
    if not exists (
        select 1 from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'pvp_matches'
    ) then
        alter publication supabase_realtime add table pvp_matches;
    end if;
end $$;


-- ==========================================================
-- File d'attente pour la recherche automatique d'adversaire ("Rechercher
-- un adversaire" dans le menu PvP). Chaque joueur en recherche y dépose une
-- ligne ; dès qu'un autre joueur arrive, il la réclame et crée directement
-- la partie dans pvp_matches ci-dessus.
-- ==========================================================

create table if not exists pvp_queue (
    id bigint generated always as identity primary key,

    pseudo text not null,
    team jsonb not null,

    status text not null default 'waiting', -- waiting | matched
    match_code text,

    created_at timestamptz not null default now()
);

alter table pvp_queue enable row level security;

drop policy if exists "Lecture publique de la file PvP" on pvp_queue;
create policy "Lecture publique de la file PvP" on pvp_queue
    for select using (true);

drop policy if exists "Creation publique dans la file PvP" on pvp_queue;
create policy "Creation publique dans la file PvP" on pvp_queue
    for insert with check (true);

drop policy if exists "Mise a jour publique de la file PvP" on pvp_queue;
create policy "Mise a jour publique de la file PvP" on pvp_queue
    for update using (true);

drop policy if exists "Suppression publique de la file PvP" on pvp_queue;
create policy "Suppression publique de la file PvP" on pvp_queue
    for delete using (true);

do $$
begin
    if not exists (
        select 1 from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'pvp_queue'
    ) then
        alter publication supabase_realtime add table pvp_queue;
    end if;
end $$;
