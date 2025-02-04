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

    // Upload file to Vercel Blob Storage
    const { url } = await put(`models/${modelId}.glb`, file, {
      access: 'public',
    });

    // Create new avatar data
    const avatarData: AvatarData = {
      id: modelId,
      modelPath: url,
      originalUrl: originalUrl,
      createdAt: new Date().toISOString(),
    };

    // Store avatar data in Vercel KV
    await kv.hset('avatars', {
      [modelId]: JSON.stringify(avatarData)
    });

    return NextResponse.json({ success: true, avatar: avatarData });
  } catch (error) {
    console.error('Error saving avatar:', error);
    return NextResponse.json({ error: 'Error saving avatar' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Get all avatars from Vercel KV
    const avatarsMap = await kv.hgetall('avatars');
    const avatars = Object.values(avatarsMap || {}).map(str => JSON.parse(str as string));
    return NextResponse.json(avatars);
  } catch (error) {
    console.error('Error reading avatars:', error);
    return NextResponse.json([], { status: 500 });
  }
} 