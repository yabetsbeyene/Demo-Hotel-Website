import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { audit, requireAdmin } from '@/lib/server/auth';
import { query } from '@/lib/server/db';

const ALLOWED_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp']
]);
const MAX_FILE_SIZE = 8 * 1024 * 1024;

export async function GET() {
  try {
    await requireAdmin();
    const result = await query('SELECT * FROM gallery_images ORDER BY category, sort_order, created_at DESC');
    return NextResponse.json({ images: result.rows });
  } catch {
    return NextResponse.json({ error: 'Unable to load gallery.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin('admin');
    const form = await request.formData();
    const file = form.get('file');
    const altText = form.get('altText');
    const category = form.get('category') || 'other';

    if (!(file instanceof File) || !ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE || typeof altText !== 'string' || !altText.trim()) {
      return NextResponse.json({ error: 'Upload a JPG, PNG, or WebP image up to 8MB with alt text.' }, { status: 400 });
    }

    const extension = ALLOWED_TYPES.get(file.type)!;
    const filename = `${randomUUID()}.${extension}`;
    const uploadDirectory = path.resolve(process.env.UPLOAD_DIR || './public/uploads');
    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(path.join(uploadDirectory, filename), Buffer.from(await file.arrayBuffer()));

    const result = await query(
      `INSERT INTO gallery_images (room_type_id, category, title, alt_text, image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [form.get('roomTypeId') || null, category, form.get('title') || null, altText.trim(), `/uploads/${filename}`]
    );

    await audit(admin.id, 'gallery_image.created', 'gallery_image', result.rows[0].id);
    return NextResponse.json({ image: result.rows[0] }, { status: 201 });
  } catch (error) {
    const forbidden = error instanceof Error && error.message === 'FORBIDDEN';
    return NextResponse.json({ error: forbidden ? 'Only administrators can upload images.' : 'Unable to upload image.' }, { status: forbidden ? 403 : 500 });
  }
}
