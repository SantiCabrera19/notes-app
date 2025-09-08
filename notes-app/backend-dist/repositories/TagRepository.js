"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagRepository = void 0;
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
class TagRepository {
    async findAll() {
        const tags = await prisma.tag.findMany({
            orderBy: {
                name: 'asc',
            },
        });
        return tags.map(tag => ({
            id: tag.id,
            name: tag.name,
            notes: [], // We'll load notes separately if needed
        }));
    }
    async findById(id) {
        const tag = await prisma.tag.findUnique({
            where: { id },
        });
        if (!tag)
            return null;
        return {
            id: tag.id,
            name: tag.name,
            notes: [], // We'll load notes separately if needed
        };
    }
    async findByName(name) {
        const tag = await prisma.tag.findUnique({
            where: { name },
        });
        if (!tag)
            return null;
        return {
            id: tag.id,
            name: tag.name,
            notes: [], // We'll load notes separately if needed
        };
    }
    async create(data) {
        const tag = await prisma.tag.create({
            data: {
                name: data.name.trim(),
            },
        });
        return {
            id: tag.id,
            name: tag.name,
            notes: [],
        };
    }
    async update(id, data) {
        try {
            const tag = await prisma.tag.update({
                where: { id },
                data: {
                    name: data.name.trim(),
                },
            });
            return {
                id: tag.id,
                name: tag.name,
                notes: [],
            };
        }
        catch (error) {
            return null;
        }
    }
    async delete(id) {
        try {
            await prisma.tag.delete({
                where: { id },
            });
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async findOrCreate(name) {
        const existingTag = await this.findByName(name.trim());
        if (existingTag) {
            return existingTag;
        }
        return await this.create({ name: name.trim() });
    }
    async findByIds(ids) {
        const tags = await prisma.tag.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
        return tags.map(tag => ({
            id: tag.id,
            name: tag.name,
            notes: [],
        }));
    }
}
exports.TagRepository = TagRepository;
//# sourceMappingURL=TagRepository.js.map