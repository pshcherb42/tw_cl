import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { initMongoose } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import User from '@/models/User'

const s3Client = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  },
});

export async function POST(req: NextRequest) {
  await initMongoose();
  

  try {
    const formData = await req.formData();
    let fieldName = '';
    let file: File | null = null;

    // Check for possible fields
    if (formData.has('cover')) {
      fieldName = 'cover';
      file = formData.get('cover') as File;
    } else if (formData.has('image')) {
      fieldName = 'image';
      file = formData.get('image') as File;
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
    const Location = `https://polina-twitter-clone.s3.${region}.amazonaws.com/${filename}`;
    const session = await getServerSession(authOptions);
    
    const user = await User.findByIdAndUpdate(session.user.id, {
       [fieldName]: Location,
      });
    
    return NextResponse.json({ 
      Location,
      user,
      data, 
      fileInfo: {
        originalFilename: file.name,
        key: filename,
        size: file.size,
        type: file.type
      },
      src:Location
    });
  } catch (err: any) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}