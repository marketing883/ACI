-- Remove the two checklist publications from the production projection.
--
-- Why this exists: ACI staging and production share one Supabase project,
-- so the receiver verification checklist (scripts/test-tapresume-receiver.mjs)
-- wrote its test openings into the live database. TapResume's first live
-- manifest walk found them and reported them as drift - publications the
-- ACI receiver serves that TapResume has no provenance row for. That is
-- the walk working correctly. But contract section 12 gate 4 needs three
-- consecutive clean reconciliation days, and it cannot start while
-- undeclared entries are present.
--
-- The two ids were reported by TapResume's reconciliation run:
--   29541641-be9d-4304-a420-303e0a22fda9
--   84545fc7-5805-4269-b7f4-61ea6f07a26c
--
-- These are test artifacts, not real publications, so they are removed
-- rather than declared as permanent known exclusions.
--
-- NOT idempotent-by-accident: every statement names the two ids
-- explicitly. Nothing here can touch a real publication or a real job.

-- ---------------------------------------------------------------------
-- STEP 1 - PREVIEW. Run this alone first and read the output.
--
-- Expect exactly 2 rows, both titled 'TapResume Checklist Opening...',
-- both managed_by = 'tapresume', both status 'closed'. If you see a row
-- that does not look like a checklist artifact, STOP and do not run
-- step 2.
-- ---------------------------------------------------------------------

select
  p.tapresume_publication_id,
  p.applied_version,
  p.applied_state,
  p.aci_job_id,
  j.title,
  j.status,
  j.managed_by,
  j.closes_at,
  (select count(*) from public.tapresume_events e
     where e.tapresume_publication_id = p.tapresume_publication_id) as event_rows
from public.tapresume_publications p
left join public.jobs j on j.id = p.aci_job_id
where p.tapresume_publication_id in (
  '29541641-be9d-4304-a420-303e0a22fda9',
  '84545fc7-5805-4269-b7f4-61ea6f07a26c'
);

-- ---------------------------------------------------------------------
-- STEP 2 - DELETE. Only after step 2's preview looks right.
--
-- Order matters. The jobs rows go last: tapresume_publications.aci_job_id
-- references jobs(id) ON DELETE SET NULL, so deleting a job first would
-- silently blank the link and leave the projection row orphaned and
-- harder to identify.
--
-- The jobs delete carries managed_by = 'tapresume' as a belt-and-braces
-- guard: even with a wrong id in the list, it cannot remove a job that
-- the receiver does not own.
-- ---------------------------------------------------------------------

begin;

delete from public.tapresume_events
where tapresume_publication_id in (
  '29541641-be9d-4304-a420-303e0a22fda9',
  '84545fc7-5805-4269-b7f4-61ea6f07a26c'
);

delete from public.jobs
where managed_by = 'tapresume'
  and id in (
    select aci_job_id from public.tapresume_publications
    where tapresume_publication_id in (
      '29541641-be9d-4304-a420-303e0a22fda9',
      '84545fc7-5805-4269-b7f4-61ea6f07a26c'
    )
    and aci_job_id is not null
  );

delete from public.tapresume_publications
where tapresume_publication_id in (
  '29541641-be9d-4304-a420-303e0a22fda9',
  '84545fc7-5805-4269-b7f4-61ea6f07a26c'
);

commit;

-- ---------------------------------------------------------------------
-- STEP 3 - VERIFY. All three counts must be 0.
-- ---------------------------------------------------------------------

select
  (select count(*) from public.tapresume_publications
     where tapresume_publication_id in (
       '29541641-be9d-4304-a420-303e0a22fda9',
       '84545fc7-5805-4269-b7f4-61ea6f07a26c')) as publications_left,
  (select count(*) from public.tapresume_events
     where tapresume_publication_id in (
       '29541641-be9d-4304-a420-303e0a22fda9',
       '84545fc7-5805-4269-b7f4-61ea6f07a26c')) as events_left,
  (select count(*) from public.jobs
     where managed_by = 'tapresume') as managed_jobs_left;

-- managed_jobs_left should also be 0 today, because the only managed jobs
-- in this database are the two checklist artifacts. Once real TapResume
-- publications arrive after cutover, that number is expected to be
-- non-zero and is NOT a problem - the first two columns are the ones that
-- must stay at 0.
