import { PrismaClient } from '@prisma/client';
import { NextApiHandler } from 'next';

const prisma = new PrismaClient();

const Populate: NextApiHandler = async (req, res) => {};
