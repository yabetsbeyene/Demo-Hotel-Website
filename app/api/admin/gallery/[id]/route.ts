import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { audit, requireAdmin } from '@/lib/server/auth';
import { query } from '@/lib/server/db';

export async function DELETE(_request: Request, { params }: { params: { id: string } }) { try { const admin = await requireAdmin('admin'); const result = await query<{ image_url: string }>('DELETE FROM gallery_images WHERE id = $1 RETURNING image_url', [params.id]); if (!result.rows[0]) return NextResponse.json({ error: 'Image not found.' }, { status: 404 }); const imageUrl = result.rows[0].image_url; if (imageUrl.startsWith('/uploads/')) await unlink(path.resolve(process.env.UPLOAD_DIR || './public/uploads', path.basename(imageUrl))).catch(() => undefined); await audit(admin.id, 'gallery_image.deleted', 'gallery_image', params.id); return NextResponse.json({ ok: true }); } catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === 'FORBIDDEN' ? 'Only administrators can delete images.' : 'Unable to delete image.' }, { status: error instanceof Error && error.message === 'FORBIDDEN' ? 403 : 500 }); } }
