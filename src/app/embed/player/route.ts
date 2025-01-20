export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET() {
  return new Response(null, {
    status: 200,
  });
} 