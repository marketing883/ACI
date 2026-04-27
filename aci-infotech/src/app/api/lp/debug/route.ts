import { NextResponse } from 'next/server';
import { getAllLPSlugs, getLPContent } from '@/lib/lp-content';

export async function GET() {
  const slugs = getAllLPSlugs();

  // Test a few specific slugs
  const testSlugs = [
    'data-engineering-services',
    'servicenow-implementation',
    'servicenow-itsm',
    'servicenow-hr-service-delivery',
    'braze-implementation',
  ];

  const results = testSlugs.map(slug => ({
    slug,
    exists: !!getLPContent(slug),
    inList: slugs.includes(slug),
  }));

  return NextResponse.json({
    totalSlugs: slugs.length,
    allSlugs: slugs,
    testResults: results,
  });
}
