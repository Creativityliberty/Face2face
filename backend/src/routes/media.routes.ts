// backend/src/routes/media.routes.ts – routes for media upload & recent list
import { FastifyInstance } from 'fastify';
import { prisma } from '../utils/database';
import { pipeline } from 'stream';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const pump = promisify(pipeline);

export async function mediaRoutes(fastify: FastifyInstance) {
  // POST /api/media/upload
  fastify.post('/upload', async (request, reply) => {
    // fastify-multipart adds request.file() helper
    const data = await request.file();
    if (!data) {
      return reply.status(400).send({ error: 'No file uploaded' });
    }
    const { filename, mimetype, file } = data;
    // type is sent as a form field
    const body = request.body as any;
    const type = (body?.type as string) ?? 'image';

    // generate unique filename
    const ext = path.extname(filename);
    const newName = `${uuidv4()}${ext}`;
    const uploadDir = path.resolve(process.cwd(), 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, newName);

    // stream file to disk
    await pump(file, fs.createWriteStream(filePath));

    // Build public URL – in dev we can serve via fastify-static (not added here)
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`;
    const url = `${baseUrl}/uploads/${newName}`;

    // Persist record (userId optional – auth middleware may set request.user)
    const userId = (request as any).user?.id ?? null;
    await prisma.media.create({
      data: {
        filename: newName,
        originalName: filename,
        mimeType: mimetype,
        size: data.file.truncated ? 0 : (data.file as any).bytesRead ?? 0,
        url,
        userId: userId ?? undefined,
      },
    });

    return reply.send({ url });
  });

  // GET /api/media/recent – latest 20 media entries
  fastify.get('/recent', async (request, reply) => {
    const medias = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return reply.send(medias);
  });
}
