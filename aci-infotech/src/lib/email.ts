import { Resend } from 'resend';
import { generateWhitepaperNurturing, WhitepaperNurturingContent } from './intelligence';

// Initialize Resend client
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'ACI Infotech <noreply@aci-infotech.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'leads@aci-infotech.com';
// Resource Management Group (India) — gets every new candidate application
// for triage. Override via env if the inbox ever changes; the default keeps
// the wiring honest if the env var is missing.
const RMG_EMAIL = process.env.RMG_EMAIL || 'rmg.india@aciinfotech.com';
// Dedicated sender for job-application notifications so they thread
// separately from lead/marketing mail and recruiters can filter on it.
// NOTE: the domain on this address (aciinfotech.com) must be verified
// in Resend or the send will fail. The other transactional mail in
// this file uses aci-infotech.com (hyphenated) — confirm both domains
// are verified, or align them.
const JOB_NOTIFICATION_FROM_EMAIL =
  process.env.JOB_NOTIFICATION_FROM_EMAIL ||
  'ACI Infotech Careers <no-reply-job-notification@aciinfotech.com>';

interface LeadNotificationData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName: string;
  jobTitle: string;
  lookingFor: string;
  landingPage: string;
  serviceCluster: string;
  utmSource?: string;
  utmCampaign?: string;
}

interface ThankYouEmailData {
  firstName: string;
  email: string;
  serviceCluster: string;
  lookingFor: string;
  ctoText: string;
}

// Send notification email to admin/sales team
export async function sendLeadNotificationEmail(data: LeadNotificationData): Promise<boolean> {
  if (!resend) {
    console.log('[Email] Resend not configured - skipping admin notification');
    console.log('[Email] Lead data:', data);
    return false;
  }

  const subject = `New LP Lead: ${data.companyName} - ${data.serviceCluster}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0066FF; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">New Landing Page Lead</h1>
      </div>

      <div style="padding: 30px; background: #f9f9f9;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #0066FF; margin-top: 0;">Contact Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;">Name:</td>
              <td style="padding: 8px 0; font-weight: bold;">${data.firstName} ${data.lastName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #0066FF;">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Phone:</td>
              <td style="padding: 8px 0;">${data.phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Company:</td>
              <td style="padding: 8px 0; font-weight: bold;">${data.companyName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Job Title:</td>
              <td style="padding: 8px 0;">${data.jobTitle}</td>
            </tr>
          </table>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #0066FF; margin-top: 0;">Interest Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;">Looking For:</td>
              <td style="padding: 8px 0; font-weight: bold;">${data.lookingFor}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Service Area:</td>
              <td style="padding: 8px 0;">${data.serviceCluster}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Landing Page:</td>
              <td style="padding: 8px 0;">${data.landingPage}</td>
            </tr>
          </table>
        </div>

        ${data.utmSource || data.utmCampaign ? `
        <div style="background: white; padding: 20px; border-radius: 8px;">
          <h2 style="color: #0066FF; margin-top: 0;">Campaign Attribution</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${data.utmSource ? `<tr><td style="padding: 8px 0; color: #666; width: 140px;">Source:</td><td style="padding: 8px 0;">${data.utmSource}</td></tr>` : ''}
            ${data.utmCampaign ? `<tr><td style="padding: 8px 0; color: #666;">Campaign:</td><td style="padding: 8px 0;">${data.utmCampaign}</td></tr>` : ''}
          </table>
        </div>
        ` : ''}
      </div>

      <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
        <p>This lead was captured from the ACI Infotech landing page system.</p>
      </div>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject,
      html,
    });

    if (error) {
      console.error('[Email] Failed to send admin notification:', error);
      return false;
    }

    console.log('[Email] Admin notification sent successfully');
    return true;
  } catch (error) {
    console.error('[Email] Error sending admin notification:', error);
    return false;
  }
}

// Send thank you email to the lead
export async function sendThankYouEmail(data: ThankYouEmailData): Promise<boolean> {
  if (!resend) {
    console.log('[Email] Resend not configured - skipping thank you email');
    return false;
  }

  const subject = `Thank you for your interest, ${data.firstName}!`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0066FF 0%, #0044AA 100%); color: white; padding: 40px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Thank You, ${data.firstName}!</h1>
        <p style="margin: 15px 0 0 0; opacity: 0.9;">We've received your request and will be in touch shortly.</p>
      </div>

      <div style="padding: 40px 30px; background: #ffffff;">
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Thank you for your interest in our <strong>${data.serviceCluster}</strong> services.
        </p>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Based on your interest in <strong>"${data.lookingFor}"</strong>, one of our specialists will reach out within 24 business hours to discuss how we can help.
        </p>

        <div style="background: #f5f7fa; padding: 25px; border-radius: 8px; margin: 30px 0;">
          <h3 style="margin: 0 0 15px 0; color: #0066FF;">What happens next?</h3>
          <ol style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
            <li>A specialist will review your requirements</li>
            <li>We'll schedule a brief discovery call at your convenience</li>
            <li>You'll receive a customized assessment or roadmap</li>
          </ol>
        </div>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          In the meantime, feel free to explore our resources:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://aci-infotech.com/blog" style="display: inline-block; background: #0066FF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;">Read Our Blog</a>
          <a href="https://aci-infotech.com/case-studies" style="display: inline-block; background: #f5f7fa; color: #0066FF; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px; border: 1px solid #0066FF;">View Case Studies</a>
        </div>
      </div>

      <div style="padding: 30px; background: #0A1628; color: #ffffff; text-align: center;">
        <p style="margin: 0 0 10px 0; font-size: 14px;">ACI Infotech</p>
        <p style="margin: 0; font-size: 12px; opacity: 0.7;">Enterprise Data Engineering | AI/ML | Cloud Modernization</p>
        <div style="margin-top: 20px;">
          <a href="https://aci-infotech.com" style="color: #7CB3FF; text-decoration: none; font-size: 12px;">aci-infotech.com</a>
        </div>
      </div>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject,
      html,
    });

    if (error) {
      console.error('[Email] Failed to send thank you email:', error);
      return false;
    }

    console.log('[Email] Thank you email sent to:', data.email);
    return true;
  } catch (error) {
    console.error('[Email] Error sending thank you email:', error);
    return false;
  }
}

// Whitepaper lead notification interfaces
interface WhitepaperLeadNotificationData {
  name: string;
  email: string;
  company?: string;
  whitepaperSlug: string;
  whitepaperTitle: string;
}

interface WhitepaperThankYouData {
  name: string;
  email: string;
  company?: string;
  whitepaperSlug: string;
  whitepaperTitle: string;
}

// Send notification email to admin when whitepaper is downloaded
export async function sendWhitepaperLeadNotification(data: WhitepaperLeadNotificationData): Promise<boolean> {
  if (!resend) {
    console.log('[Email] Resend not configured - skipping whitepaper lead notification');
    console.log('[Email] Whitepaper lead data:', data);
    return false;
  }

  const subject = `New Whitepaper Download: ${data.whitepaperTitle}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0066FF; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">New Whitepaper Download</h1>
      </div>

      <div style="padding: 30px; background: #f9f9f9;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #0066FF; margin-top: 0;">Contact Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;">Name:</td>
              <td style="padding: 8px 0; font-weight: bold;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #0066FF;">${data.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Company:</td>
              <td style="padding: 8px 0;">${data.company || 'Not provided'}</td>
            </tr>
          </table>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px;">
          <h2 style="color: #0066FF; margin-top: 0;">Whitepaper Downloaded</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;">Title:</td>
              <td style="padding: 8px 0; font-weight: bold;">${data.whitepaperTitle}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Slug:</td>
              <td style="padding: 8px 0;">${data.whitepaperSlug}</td>
            </tr>
          </table>
        </div>
      </div>

      <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
        <p>This lead was captured from the ACI Infotech whitepaper download system.</p>
      </div>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject,
      html,
    });

    if (error) {
      console.error('[Email] Failed to send whitepaper lead notification:', error);
      return false;
    }

    console.log('[Email] Whitepaper lead notification sent successfully');
    return true;
  } catch (error) {
    console.error('[Email] Error sending whitepaper lead notification:', error);
    return false;
  }
}

// Send thank you email with AI-generated nurturing content
export async function sendWhitepaperThankYouEmail(data: WhitepaperThankYouData): Promise<boolean> {
  if (!resend) {
    console.log('[Email] Resend not configured - skipping whitepaper thank you email');
    return false;
  }

  const firstName = data.name.split(' ')[0];

  // Generate AI-powered nurturing content
  let nurturing: WhitepaperNurturingContent;
  try {
    nurturing = await generateWhitepaperNurturing(
      data.whitepaperTitle,
      data.whitepaperSlug,
      data.name,
      data.company
    );
  } catch (error) {
    console.error('[Email] Failed to generate nurturing content, using defaults:', error);
    nurturing = {
      relatedTopics: ['Enterprise Architecture', 'Digital Transformation', 'Technology Strategy'],
      valueProps: ['80+ Fortune 500 clients', '$1B+ value delivered', '95% client retention'],
      caseStudies: ['Global Financial Giant: Enterprise-wide data transformation', 'Global Hospitality Leader: 400K employee platform'],
      nextSteps: ['Schedule an architecture call', 'Explore our case studies', 'Connect with our architects'],
      ctaText: 'Schedule Architecture Call',
      ctaUrl: 'https://aci-infotech.com/contact?reason=architecture-call',
    };
  }

  const subject = `Your whitepaper is ready: ${data.whitepaperTitle}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0066FF 0%, #0044AA 100%); color: white; padding: 40px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Thank You, ${firstName}!</h1>
        <p style="margin: 15px 0 0 0; opacity: 0.9;">Your whitepaper download is confirmed.</p>
      </div>

      <div style="padding: 40px 30px; background: #ffffff;">
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Thank you for downloading <strong>"${data.whitepaperTitle}"</strong>. We hope you find the insights valuable for your organization's journey.
        </p>

        <div style="background: #f5f7fa; padding: 25px; border-radius: 8px; margin: 30px 0;">
          <h3 style="margin: 0 0 15px 0; color: #0066FF;">Explore Related Topics</h3>
          <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
            ${nurturing.relatedTopics.map(topic => `<li>${topic}</li>`).join('')}
          </ul>
        </div>

        <div style="background: #E8F4FF; border-left: 4px solid #0066FF; padding: 20px; margin: 30px 0;">
          <h3 style="margin: 0 0 15px 0; color: #0A1628;">Why ACI Infotech?</h3>
          <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
            ${nurturing.valueProps.map(prop => `<li>${prop}</li>`).join('')}
          </ul>
        </div>

        <div style="background: #f5f7fa; padding: 25px; border-radius: 8px; margin: 30px 0;">
          <h3 style="margin: 0 0 15px 0; color: #0066FF;">Relevant Case Studies</h3>
          <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
            ${nurturing.caseStudies.map(cs => `<li>${cs}</li>`).join('')}
          </ul>
        </div>

        <div style="background: #E8F4FF; border-left: 4px solid #0066FF; padding: 20px; margin: 30px 0;">
          <h3 style="margin: 0 0 10px 0; color: #0A1628;">Ready to Take the Next Step?</h3>
          <p style="margin: 0 0 15px 0; color: #555;">
            Our architects can provide personalized guidance based on your specific challenges and goals.
          </p>
          <a href="${nurturing.ctaUrl}" style="display: inline-block; background: #0066FF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            ${nurturing.ctaText}
          </a>
        </div>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          More resources you might find helpful:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://aci-infotech.com/whitepapers" style="display: inline-block; background: #f5f7fa; color: #0066FF; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px; border: 1px solid #0066FF;">More Whitepapers</a>
          <a href="https://aci-infotech.com/case-studies" style="display: inline-block; background: #f5f7fa; color: #0066FF; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px; border: 1px solid #0066FF;">Case Studies</a>
          <a href="https://aci-infotech.com/blog" style="display: inline-block; background: #f5f7fa; color: #0066FF; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px; border: 1px solid #0066FF;">Blog</a>
        </div>
      </div>

      <div style="padding: 30px; background: #0A1628; color: #ffffff; text-align: center;">
        <p style="margin: 0 0 10px 0; font-size: 14px;">ACI Infotech</p>
        <p style="margin: 0; font-size: 12px; opacity: 0.7;">Enterprise Data Engineering | AI/ML | Cloud Modernization</p>
        <div style="margin-top: 20px;">
          <a href="https://aci-infotech.com" style="color: #7CB3FF; text-decoration: none; font-size: 12px;">aci-infotech.com</a>
        </div>
      </div>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject,
      html,
    });

    if (error) {
      console.error('[Email] Failed to send whitepaper thank you email:', error);
      return false;
    }

    console.log('[Email] Whitepaper thank you email sent to:', data.email);
    return true;
  } catch (error) {
    console.error('[Email] Error sending whitepaper thank you email:', error);
    return false;
  }
}

// Job application notification interfaces
interface JobApplicationNotificationData {
  jobTitle: string;
  jobLocation?: string | null;
  applicationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  currentCompany?: string | null;
  currentTitle?: string | null;
  yearsExperience?: number | null;
  coverLetter?: string | null;
  source?: string | null;
  referralName?: string | null;
  resumeFilename?: string | null;
  /** Pre-signed download URL for the resume, valid for ~7 days. */
  resumeDownloadUrl?: string | null;
  /** Public URL where the recruiter can review the full application. */
  adminViewUrl?: string;
}

// Send notification email to RMG India when a candidate submits an application.
// Mirrors the lead-notification pattern: rich plaintext block plus a styled
// HTML version. Failure here must NEVER bubble up — the candidate's
// application is already in the DB; emailing is a courtesy to the recruiters,
// not a transactional requirement.
export async function sendJobApplicationNotificationEmail(
  data: JobApplicationNotificationData,
): Promise<boolean> {
  if (!resend) {
    console.log('[Email] Resend not configured - skipping job application notification');
    console.log('[Email] Application data:', {
      job: data.jobTitle,
      candidate: `${data.firstName} ${data.lastName}`,
      email: data.email,
    });
    return false;
  }

  const candidateName = `${data.firstName} ${data.lastName}`.trim();
  const subject = `New application: ${candidateName} — ${data.jobTitle}`;

  const row = (label: string, value: string | null | undefined) =>
    value
      ? `<tr><td style="padding: 8px 0; color: #666; width: 160px;">${label}:</td><td style="padding: 8px 0;">${value}</td></tr>`
      : '';

  const linkRow = (label: string, href: string | null | undefined) =>
    href
      ? `<tr><td style="padding: 8px 0; color: #666; width: 160px;">${label}:</td><td style="padding: 8px 0;"><a href="${href}" style="color: #0066FF;">${href}</a></td></tr>`
      : '';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
      <div style="background: #0A1628; color: white; padding: 24px 28px;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 700;">New Job Application</h1>
        <p style="margin: 8px 0 0 0; opacity: 0.85; font-size: 14px;">${data.jobTitle}${data.jobLocation ? ` · ${data.jobLocation}` : ''}</p>
      </div>

      <div style="padding: 28px; background: #f7f8fa;">
        <div style="background: white; padding: 22px; border-radius: 8px; margin-bottom: 18px;">
          <h2 style="color: #0A1628; margin: 0 0 14px 0; font-size: 16px;">Candidate</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${row('Name', candidateName)}
            ${row('Email', `<a href="mailto:${data.email}" style="color: #0066FF;">${data.email}</a>`)}
            ${row('Phone', data.phone ?? null)}
            ${linkRow('LinkedIn', data.linkedinUrl ?? null)}
            ${linkRow('Portfolio', data.portfolioUrl ?? null)}
          </table>
        </div>

        <div style="background: white; padding: 22px; border-radius: 8px; margin-bottom: 18px;">
          <h2 style="color: #0A1628; margin: 0 0 14px 0; font-size: 16px;">Current Role</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${row('Company', data.currentCompany ?? null)}
            ${row('Title', data.currentTitle ?? null)}
            ${row('Experience', data.yearsExperience != null ? `${data.yearsExperience} year${data.yearsExperience === 1 ? '' : 's'}` : null)}
          </table>
        </div>

        <div style="background: white; padding: 22px; border-radius: 8px; margin-bottom: 18px;">
          <h2 style="color: #0A1628; margin: 0 0 14px 0; font-size: 16px;">Resume &amp; Cover Letter</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${
              data.resumeDownloadUrl
                ? `<tr><td style="padding: 8px 0; color: #666; width: 160px;">Resume:</td><td style="padding: 8px 0;"><a href="${data.resumeDownloadUrl}" style="color: #0066FF;">${data.resumeFilename || 'Download resume'}</a> <span style="color: #999; font-size: 12px;">(link valid 7 days)</span></td></tr>`
                : row('Resume', data.resumeFilename ?? 'No resume attached')
            }
          </table>
          ${
            data.coverLetter
              ? `<div style="margin-top: 14px;"><div style="color: #666; font-size: 13px; margin-bottom: 6px;">Cover letter</div><div style="white-space: pre-wrap; padding: 14px; background: #f7f8fa; border-radius: 6px; color: #333; font-size: 13px; line-height: 1.55;">${data.coverLetter.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] || c))}</div></div>`
              : ''
          }
        </div>

        ${
          data.source || data.referralName
            ? `<div style="background: white; padding: 22px; border-radius: 8px; margin-bottom: 18px;">
                 <h2 style="color: #0A1628; margin: 0 0 14px 0; font-size: 16px;">Source</h2>
                 <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                   ${row('Source', data.source ?? null)}
                   ${row('Referral', data.referralName ?? null)}
                 </table>
               </div>`
            : ''
        }

        ${
          data.adminViewUrl
            ? `<div style="text-align: center; margin-top: 8px;">
                 <a href="${data.adminViewUrl}" style="display: inline-block; background: #0066FF; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Open in Admin</a>
               </div>`
            : ''
        }
      </div>

      <div style="padding: 18px; text-align: center; color: #888; font-size: 11px; background: #f0f1f3;">
        Application ID: ${data.applicationId}
      </div>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: JOB_NOTIFICATION_FROM_EMAIL,
      to: RMG_EMAIL,
      replyTo: data.email,
      subject,
      html,
    });

    if (error) {
      console.error('[Email] Failed to send job application notification:', error);
      return false;
    }

    console.log('[Email] Job application notification sent for:', data.email);
    return true;
  } catch (error) {
    console.error('[Email] Error sending job application notification:', error);
    return false;
  }
}
