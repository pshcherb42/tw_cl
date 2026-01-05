import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { initMongoose } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/models/User";

const s3Client = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  },
});

export async function POST(req: NextRequest) {
  await initMongoose();
  const session = await getServerSession(authOptions);
  
  try {
    const formData = await req.formData();
    
    // Get the first file and its field name (type)
    let file: File | null = null;
    let type: string = '';
    
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        file = value;
        type = key; // This captures 'cover', 'image', or any other field name
        break;
      }
    }
    
    if (!file) {
      throw new Error('No file uploaded');
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = Date.now() + '-' + file.name;
    
    const command = new PutObjectCommand({
      Bucket: 'polina-twitter-clone',
      Body: buffer,
      ACL: 'public-read',
      Key: filename,
      ContentType: file.type,
    });
    
    const data = await s3Client.send(command);
    const region = 'eu-north-1';
    const src = `https://polina-twitter-clone.s3.${region}.amazonaws.com/${filename}`;
    
    // Update user if uploading cover or image
    if (session && (type === 'cover' || type === 'image')) {
      await User.findByIdAndUpdate(session.user.id, {
        [type]: src,
      });
    }
    
    return NextResponse.json({
      src,
      data,
      fileInfo: {
        originalFilename: file.name,
        key: filename,
        size: file.size,
        type: file.type
      }
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}