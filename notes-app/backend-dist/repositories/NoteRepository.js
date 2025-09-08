"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteRepository = void 0;
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
class NoteRepository {
    async findAll(archived) {
        return await prisma.note.findMany({
            where: archived !== undefined ? { isArchived: archived } : {},
            include: {
                tags: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
    }
    async findById(id) {
        return await prisma.note.findUnique({
            where: { id },
            include: {
                tags: true,
            },
        });
    }
    async create(data) {
        const { tagIds, ...noteData } = data;
        return await prisma.note.create({
            data: {
                ...noteData,
                tags: tagIds && tagIds.length > 0 ? {
                    connect: tagIds.map(id => ({ id })),
                } : undefined,
            },
            include: {
                tags: true,
            },
        });
    }
    async update(id, data) {
        const { tagIds, ...noteData } = data;
        return await prisma.note.update({
            where: { id },
            data: {
                ...noteData,
                tags: tagIds ? {
                    set: tagIds.length > 0 ? tagIds.map(tagId => ({ id: tagId })) : [],
                } : undefined,
            },
            include: {
                tags: true,
            },
        });
    }
    async delete(id) {
        try {
            await prisma.note.delete({
                where: { id },
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async toggleArchive(id) {
        const note = await this.findById(id);
        if (!note)
            return null;
        return await prisma.note.update({
            where: { id },
            data: {
                isArchived: !note.isArchived,
            },
            include: {
                tags: true,
            },
        });
    }
    async findByTags(tagIds, archived) {
        return await prisma.note.findMany({
            where: {
                AND: [
                    archived !== undefined ? { isArchived: archived } : {},
                    {
                        tags: {
                            some: {
                                id: {
                                    in: tagIds,
                                },
                            },
                        },
                    },
                ],
            },
            include: {
                tags: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
    }
    async searchNotes(query, archived) {
        return await prisma.note.findMany({
            where: {
                AND: [
                    archived !== undefined ? { isArchived: archived } : {},
                    {
                        OR: [
                            {
                                title: {
                                    contains: query,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                content: {
                                    contains: query,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                ],
            },
            include: {
                tags: true,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
    }
}
exports.NoteRepository = NoteRepository;
//# sourceMappingURL=NoteRepository.js.map