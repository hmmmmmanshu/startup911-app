import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('photo') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPG and PNG files are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `mentor-photos/${fileName}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('mentor-photos')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ 
        error: 'Failed to upload file',
        details: error.message 
      }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('mentor-photos')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      photo_url: urlData.publicUrl,
      file_path: filePath
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'An unexpected error occurred. Please try again.' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Photo upload API is working' }, { status: 200 });
}
