// Builds the applicant export archive: one spreadsheet plus every resume.
//
// Server-only (archiver and exceljs are Node libraries), and kept apart from
// job-applicants-export.ts so the pure helpers there stay importable anywhere.
//
// Streaming is the whole point. A single role here has 268 applicants and 262
// resumes; buffering that to build a zip in memory would take the process
// down. Entries are appended as each file arrives, so memory stays flat no
// matter how large the role grows.
//
// The downloader is injected so this can be driven with fakes in a test
// without a database, a bucket, or a service key.
import { Readable } from 'node:stream';
import { ZipArchive } from 'archiver';
import ExcelJS from 'exceljs';
import {
  CSV_HEADERS,
  applicantToValues,
  resumeFileName,
  type ApplicationRow,
} from './job-applicants-export';

export type ResumeDownloader = (
  storagePath: string
) => Promise<{ body: Buffer | null; error: string | null }>;

export interface ArchiveOptions {
  applications: ApplicationRow[];
  baseName: string;
  sheetName?: string;
  download: ResumeDownloader;
}

export async function buildApplicantWorkbook(
  applications: ApplicationRow[],
  resumeNames: Array<string | null>,
  sheetName: string
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  sheet.columns = CSV_HEADERS.map((header) => ({
    header,
    width: header === 'Cover letter' ? 60 : Math.max(14, Math.min(30, header.length + 6)),
  }));
  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: 'frozen', ySplit: 1 }];

  applications.forEach((app, i) => {
    const row = sheet.addRow(applicantToValues(app, resumeNames[i]));
    const file = resumeNames[i];
    if (file) {
      // Relative link: works once the zip is unpacked, because the sheet sits
      // next to the resumes folder.
      const cell = row.getCell(CSV_HEADERS.length);
      cell.value = { text: file, hyperlink: `resumes/${file}` };
      cell.font = { color: { argb: 'FF0052CC' }, underline: true };
    }
    row.alignment = { vertical: 'top' };
  });

  return Buffer.from(await workbook.xlsx.writeBuffer());
}

// Names are settled before any download so the spreadsheet can reference a
// file even if fetching it fails later. A failure is recorded in
// missing-resumes.txt, never silently dropped from the sheet.
export function plannedResumeNames(applications: ApplicationRow[]): Array<string | null> {
  return applications.map((a, i) => (a.resume_url ? resumeFileName(i + 1, a) : null));
}

// Returns the archive stream immediately and fills it in the background, so
// the browser starts receiving a download rather than waiting minutes on a
// blank tab. `finished` resolves when every entry is written, for tests and
// for anything that needs to know the run completed.
export function buildApplicantArchive({
  applications,
  baseName,
  sheetName = 'Applicants',
  download,
}: ArchiveOptions): { stream: Readable; finished: Promise<{ missing: string[] }> } {
  const archive = new ZipArchive({ zlib: { level: 6 } });
  const resumeNames = plannedResumeNames(applications);

  const finished = (async () => {
    const missing: string[] = [];
    try {
      archive.append(
        await buildApplicantWorkbook(applications, resumeNames, sheetName),
        { name: `${baseName}/applicants.xlsx` }
      );

      for (const [i, app] of applications.entries()) {
        const file = resumeNames[i];
        const who = `${app.first_name} ${app.last_name} <${app.email}>`;

        if (!file || !app.resume_url) {
          missing.push(`${who} - no resume was uploaded`);
          continue;
        }

        const { body, error } = await download(app.resume_url);
        if (error || !body) {
          missing.push(`${who} - download failed: ${error ?? 'unknown error'}`);
          continue;
        }

        // store: resumes are already-compressed PDF and Word files, so
        // deflating them again burns CPU for nothing.
        archive.append(body, { name: `${baseName}/resumes/${file}`, store: true });
      }

      // Always written, so "nothing is missing" is a statement rather than an
      // absence someone has to infer.
      archive.append(
        missing.length
          ? `${missing.length} of ${applications.length} applicants have no resume file:\n\n${missing.join('\n')}\n`
          : `All ${applications.length} applicants have a resume file.\n`,
        { name: `${baseName}/missing-resumes.txt` }
      );

      await archive.finalize();
      return { missing };
    } catch (err) {
      archive.abort();
      throw err;
    }
  })();

  return { stream: archive as unknown as Readable, finished };
}
