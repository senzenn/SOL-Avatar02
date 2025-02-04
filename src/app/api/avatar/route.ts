import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { kv } from '@vercel/kv';

interface AvatarData {
  id: string;
  modelPath: string;
  originalUrl: string;
  createdAt: string;
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN is not configured');
      return NextResponse.json({ error: 'Storage configuration missing' }, { status: 500 });
    }

    if (!process.env.KV_REST_API_TOKEN) {
      console.error('KV_REST_API_TOKEN is not configured');
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const originalUrl = formData.get('originalUrl') as string;
    const modelId = formData.get('modelId') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!modelId) {
      return NextResponse.json({ error: 'No model ID provided' }, { status: 400 });
    }

    console.log('Uploading file to blob storage...', { modelId, originalUrl });

    // Upload file to Vercel Blob Storage
    const { url } = await put(`models/${modelId}.glb`, file, {
      access: 'public',
    }).catch(error => {
      console.error('Error uploading to blob storage:', error);
      throw new Error('Failed to upload file to storage');
    });

    console.log('File uploaded successfully:', url);

    // Create new avatar data
    const avatarData: AvatarData = {
      id: modelId,
      modelPath: url,
      originalUrl: originalUrl,
      createdAt: new Date().toISOString(),
    };

    console.log('Saving avatar data to KV...', avatarData);

    // Store avatar data in Vercel KV
    await kv.hset('avatars', {
      [modelId]: JSON.stringify(avatarData)
    }).catch(error => {
      console.error('Error saving to KV:', error);
      throw new Error('Failed to save avatar data');
    });

    console.log('Avatar data saved successfully');

    return NextResponse.json({ success: true, avatar: avatarData });
  } catch (error) {
    console.error('Error in avatar API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!process.env.KV_REST_API_TOKEN) {
      console.error('KV_REST_API_TOKEN is not configured');
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    console.log('Fetching avatars from KV...');

    // Get all avatars from Vercel KV
    const avatarsMap = await kv.hgetall('avatars').catch(error => {
      console.error('Error fetching from KV:', error);
      throw new Error('Failed to fetch avatars');
    });

    if (!avatarsMap) {
      console.log('No avatars found');
      return NextResponse.json([]);
    }

    const avatars = Object.values(avatarsMap).map(str => JSON.parse(str as string));
    console.log(`Found ${avatars.length} avatars`);

    return NextResponse.json(avatars);
  } catch (error) {
    console.error('Error in GET avatars:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 