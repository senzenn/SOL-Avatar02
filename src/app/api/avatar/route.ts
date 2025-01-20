import { writeFile, readFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

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

    const modelFileName = `${modelId}.glb`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure directories exist
    const modelsDir = path.join(process.cwd(), 'public', 'models');
    const dataDir = path.join(process.cwd(), 'public', 'data');
    await fs.mkdir(modelsDir, { recursive: true });
    await fs.mkdir(dataDir, { recursive: true });

    // Save file to public/models directory
    const filePath = path.join(modelsDir, modelFileName);
    await writeFile(filePath, buffer);

    // Read existing avatar data or create new array
    let avatars: AvatarData[] = [];
    const avatarsPath = path.join(dataDir, 'avatars.json');
    
    try {
      const existingData = await readFile(avatarsPath, 'utf-8');
      avatars = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist yet, will create new
      console.log('No existing avatars.json, creating new');
    }

    // Create new avatar data
    const avatarData: AvatarData = {
      id: modelId,
      modelPath: `/models/${modelFileName}`,
      originalUrl: originalUrl,
      createdAt: new Date().toISOString(),
    };

    // Remove any existing avatar with the same ID
    avatars = avatars.filter(a => a.id !== modelId);
    // Add new avatar data
    avatars.push(avatarData);

    // Save avatar data
    await writeFile(
      avatarsPath,
      JSON.stringify(avatars, null, 2)
    );

    return NextResponse.json({ success: true, avatar: avatarData });
  } catch (error) {
    console.error('Error saving avatar:', error);
    return NextResponse.json({ error: 'Error saving avatar' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'public', 'data', 'avatars.json');
    const data = await readFile(dataPath, 'utf-8');
    const avatars = JSON.parse(data);
    return NextResponse.json(avatars);
  } catch (error) {
    console.error('Error reading avatars:', error);
    return NextResponse.json([], { status: 500 });
  }
} 