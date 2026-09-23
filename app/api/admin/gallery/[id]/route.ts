import { unlink } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { audit, requireAdmin } from '@/lib/server/auth';
import { query } from '@/lib/server/db';

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin('admin');
    const result = await query<{ image_url: string }>('DELETE FROM gallery_images WHERE id = $1 RETURNING image_url', [params.id]);
    const image = result.rows[0];

    if (!image) return NextResponse.json({ error: 'Image not found.' }, { status: 404 });
    if (image.image_url.startsWith('/uploads/')) {
      const uploadDirectory = path.resolve(process.env.UPLOAD_DIR || './public/uploads');
      await unlink(path.join(uploadDirectory, path.basename(image.image_url))).catch(() => undefined);
    }

    await audit(admin.id, 'gallery_image.deleted', 'gallery_image', params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const forbidden = error instanceof Error && error.message === 'FORBIDDEN';
    return NextResponse.json({ error: forbidden ? 'Only administrators can delete images.' : 'Unable to delete image.' }, { status: forbidden ? 403 : 500 });
  }
}
