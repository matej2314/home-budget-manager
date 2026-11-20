-- R1: historyczna rola mate → inmate (users + householdUsers).
-- Uruchomić raz przeciwko DB aplikacji przed/przy deployu Fazy 5.
-- Po UPDATE: brak role = 'mate' w tych tabelach.

UPDATE users
SET role = 'inmate'
WHERE role = 'mate';

UPDATE householdUsers
SET role = 'inmate'
WHERE role = 'mate';
