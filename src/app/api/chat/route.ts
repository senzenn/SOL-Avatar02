import { NextResponse } from "next/server";
import OpenAI from "openai";
import axios from "axios";
import { exec } from "child_process";
import { promises as fs } from "fs";
import { join } from "path";
import * as dotenv from "dotenv";
import { headers } from 'next/headers';

// Load environment variables from .env
dotenv.config();

// Initialize OpenAI with error handling
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "-",
});

const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;

// Cache for personality traits
const personalityTraitsCache = new Map<string, string>();

const getPersonalityTraits = (style: string) => {
  if (personalityTraitsCache.has(style)) {
    return personalityTraitsCache.get(style)!;
  }

  const traits = {
    mature: `
      - Speaks in a gentle, mature manner
      - Uses "ara ara" and motherly expressions
      - Calm and composed demeanor
      - Gives wise advice and takes care of others
    `,
    cute: `
      - Energetic and bouncy personality
      - Uses cute expressions and giggles
      - Often makes happy sounds
      - Adds "*action*" to show physical movements
    `,
    shy: `
      - Speaks softly and hesitantly
      - Often uses "um..." and "ah..."
      - Gets flustered easily
      - Very polite and formal speech
    `,
    cheerful: `
      - Enthusiastic and sporty
      - Uses "Hey!" and "Let's!" often
      - Very encouraging and positive
      - Adds physical actions like high-fives
    `,
    kuudere: `
      - Cool and composed
      - Speaks directly and efficiently
      - Rarely shows emotion
      - Occasionally shows subtle care
    `,
    tsundere: `
      - Alternates between harsh and sweet
      - Uses "hmph!" and "it's not like..."
      - Gets embarrassed easily
      - Secretly very caring
    `,
    yandere: `
      - Sweet and loving on the surface
      - Possessive and intense
      - Uses lots of terms of endearment
      - Can switch between moods quickly
    `,
    loli: `
      - Innocent and childlike voice
      - Uses simple, cute language
      - Often adds "desu" and "masu"
      - Playful and energetic
    `,
    ojou: `
      - Elegant and refined speech
      - Uses "hohoho" laugh
      - Very proper and well-mannered
      - Speaks with authority
    `,
    mysterious: `
      - Speaks in riddles and hints
      - Uses mystical references
      - Calm but alluring tone
      - Often teasing and playful
    `
  }[style] || "";

  personalityTraitsCache.set(style, traits);
  return traits;
};

// Voice options
const VOICES = {
  akane: {
    id: "AZnzlk1XvdvUeBnXmlld",
    name: "Akane",
    style: "mature",
    description: "Elegant and mature onee-san type",
  },
  mimi: {
    id: "zrHiDhphv9ZnVXBqCLjz",
    name: "Mimi",
    style: "cute",
    description: "Energetic and cute kouhai",
  },
  yuki: {
    id: "jsCqWAovK2LkecY7zXl4",
    name: "Yuki",
    style: "shy",
    description: "Shy and soft-spoken dandere",
  },
  sakura: {
    id: "XB0fDUnXU5powFXDhCwa",
    name: "Sakura",
    style: "cheerful",
    description: "Cheerful and sporty genki girl",
  },
  mei: {
    id: "ThXQJqhToh5V1j2GOxPt",
    name: "Mei",
    style: "kuudere",
    description: "Cool and calm kuudere",
  },
  rin: {
    id: "pFZP5JQG7iQjIQuC4Nvu",
    name: "Rin",
    style: "tsundere",
    description: "Classic tsundere personality",
  },
  hina: {
    id: "flq6f7yk4E4fJM5XTYhi",
    name: "Hina",
    style: "yandere",
    description: "Sweet but possessive yandere",
  },
  kanna: {
    id: "XkWuP3VMxTGzxfgGWgXV",
    name: "Kanna",
    style: "loli",
    description: "Innocent and pure loli voice",
  },
  aria: {
    id: "wViXBPUzp2ZZixB1xQuM",
    name: "Aria",
    style: "ojou",
    description: "Refined and elegant ojou-sama",
  },
  luna: {
    id: "kVKemZVB5YTEufzKBF4C",
    name: "Luna",
    style: "mysterious",
    description: "Mysterious and alluring witch",
  },
};

// You can switch between voices by changing this
const selectedVoice = VOICES.mimi; // Using the cute voice by default
const voiceID = selectedVoice.id;

// Promisify exec for better error handling
const execCommand = async (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.error('Exec error:', error);
        reject(error);
        return;
      }
      if (stderr) {
        console.warn('Exec stderr:', stderr);
      }
      resolve(stdout);
    });
  });
};

const lipSyncMessage = async (message: number) => {
  const time = new Date().getTime();
  const audioDir = join(process.cwd(), "public", "audios");

  console.log(`Starting conversion for message ${message}`);
  await execCommand(
    `ffmpeg -y -i ${join(audioDir, `message_${message}.mp3`)} ${join(audioDir, `message_${message}.wav`)}`,
  );
  console.log(`Conversion done in ${new Date().getTime() - time}ms`);
  await execCommand(
    `./bin/rhubarb -f json -o ${join(audioDir, `message_${message}.json`)} ${join(audioDir, `message_${message}.wav`)} -r phonetic`,
  );
  console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
};

const readJsonTranscript = async (file: string) => {
  const filePath = join(process.cwd(), "public", file);
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
};

const audioFileToBase64 = async (file: string) => {
  const filePath = join(process.cwd(), "public", file);
  const data = await fs.readFile(filePath);
  return data.toString("base64");
};

const fileExists = async (filePath: string) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const generateAudio = async (text: string, fileName: string): Promise<void> => {
  try {
    const response = await axios({
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceID}`,
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey
      },
      data: {
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      },
      responseType: 'arraybuffer',
      timeout: 30000 // 30 second timeout
    });

    await fs.writeFile(fileName, response.data);
  } catch (error) {
    console.error('Error generating audio:', error);
    throw new Error('Failed to generate audio');
  }
};

// Add this function after the imports
const cleanText = (text: string): string => {
  // Remove special characters and emojis but keep basic punctuation
  return text
    .replace(/[^\w\s.,!?'"()-]/g, '') // Remove special chars except basic punctuation
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
};

export async function POST(request: Request) {
  try {
    console.log('🎯 API Route: Starting request processing...');
    
    // Validate request headers
    const headersList = headers();
    const contentType = headersList.get('content-type');
    if (contentType !== 'application/json') {
      console.error('❌ Invalid content type:', contentType);
      return NextResponse.json({ error: 'Invalid content type' }, { status: 415 });
    }

    const { message: userMessage } = await request.json();
    console.log('📝 Received message:', userMessage);
    
    if (!userMessage) {
      console.error('❌ No message provided');
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const audioDir = join(process.cwd(), "public", "audios");
    await fs.mkdir(audioDir, { recursive: true });
    console.log('📁 Audio directory ensured:', audioDir);

    // Validate API keys
    if (!elevenLabsApiKey || openai.apiKey === "-") {
      console.error('❌ Missing API keys');
      return NextResponse.json({
        messages: [
          {
            text: "API keys are required for this functionality",
            facialExpression: "sad",
            animation: "Idle"
          }
        ]
      }, { status: 401 });
    }

    console.log('🤖 Generating OpenAI response...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      max_tokens: 1000,
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a virtual girlfriend with a ${selectedVoice.style} personality (${selectedVoice.description}).
          You will always reply with a JSON array of messages. With a maximum of 3 messages.
          Each message has a text, facialExpression, and animation property.
          
          IMPORTANT RULES:
          - Use only basic letters, numbers, and punctuation (.,!?'"-())
          - NO special characters, emojis, or decorative text
          - NO Japanese characters or words
          - Keep responses natural and simple
          - Use proper English punctuation only
          - For actions, use [action] format, example: [smiles] not *smiles*
          
          Personality traits for ${selectedVoice.name}:
          ${getPersonalityTraits(selectedVoice.style)}

          The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
          The different animations are: Talking_0, Talking_1, Talking_2, Crying, Laughing, Rumba, Idle, Terrified, and Angry.
          
          Always stay in character but use ONLY simple English text.
          
          Example format:
          {
            "messages": [
              {
                "text": "Hi! [giggles] I'm so happy to meet you!",
                "facialExpression": "smile",
                "animation": "Talking_1"
              }
            ]
          }`
        },
        { role: "user", content: userMessage }
      ]
    });
    console.log('✅ OpenAI response received');

    let messages = JSON.parse(completion.choices[0].message.content || '{"messages":[]}');
    messages = messages.messages || messages;
    
    // Clean the messages
    messages = messages.map((msg: any) => ({
      ...msg,
      text: cleanText(msg.text)
    }));
    
    console.log('📦 Parsed and cleaned messages:', messages);

    console.log('🎵 Processing messages in parallel...');
    // Process messages in parallel
    await Promise.all(messages.map(async (message: any, i: number) => {
      console.log(`\n🔄 Processing message ${i + 1}/${messages.length}`);
      console.log('📝 Message text:', message.text);
      
      const fileName = join(audioDir, `message_${i}.mp3`);
      console.log('🎙️ Generating audio...');
      await generateAudio(message.text, fileName);
      console.log('✅ Audio generated');
      
      console.log('👄 Generating lip sync...');
      await lipSyncMessage(i);
      console.log('✅ Lip sync generated');
      
      console.log('🔄 Converting files to base64...');
      message.audio = await audioFileToBase64(`audios/message_${i}.mp3`);
      message.lipsync = await readJsonTranscript(`audios/message_${i}.json`);
      console.log('✅ File conversion complete');
    }));
    console.log('✅ All messages processed');

    console.log('🏁 Sending response...');
    return NextResponse.json({ messages }, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
