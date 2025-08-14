import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import Meeting from './models/Meeting';

const app = express();
app.use(express.json());

/**
 * @swagger
 * components:
 *   schemas:
 *     Meeting:
 *       type: object
 *       required:
 *         - name
 *         - wine
 *         - location
 *         - date
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the meeting
 *         name:
 *           type: string
 *           description: The name of the meeting
 *         wine:
 *           type: string
 *           description: The wine for the meeting
 *         location:
 *           type: string
 *           description: The location of the meeting
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date of the meeting
 *       example:
 *         _id: "64f23b6e2c6d5f1a1b2c3d4e"
 *         name: "와인 모임"
 *         wine: "샤르도네"
 *         location: "서울 강남구"
 *         date: "2025-08-10T18:00:00.000Z"
 */

/**
 * @swagger
 * tags:
 *   - name: Meetings
 *     description: The meetings managing API
 */

app.get('/', (req: Request, res: Response) => {
    res.send('안녕하세요! 와인 BYOB 모임 서버입니다. 🍷');
});

/**
 * @swagger
 * /api/meetings:
 *   get:
 *     summary: Returns the list of all the meetings
 *     tags: [Meetings]
 *     responses:
 *       200:
 *         description: The list of the meetings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meeting'
 */
app.get('/api/meetings', async (req: Request, res: Response) => {
    try {
        const meetings = await Meeting.find({});
        res.status(200).json(meetings);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving meetings' });
    }
});

/**
 * @swagger
 * /api/meetings:
 *   post:
 *     summary: Create a new meeting
 *     tags: [Meetings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meeting'
 *     responses:
 *       201:
 *         description: The created meeting
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       500:
 *         description: Error creating meeting
 */
app.post('/api/meetings', async (req: Request, res: Response) => {
    try {
        const newMeeting = new Meeting(req.body);
        const savedMeeting = await newMeeting.save();
        res.status(201).json(savedMeeting);
    } catch (error) {
        res.status(500).json({ message: 'Error creating meeting' });
    }
});

/**
 * @swagger
 * /api/meetings/{id}:
 *   patch:
 *     summary: Update an existing meeting
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The meeting id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meeting'
 *     responses:
 *       200:
 *         description: The updated meeting
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meeting'
 *       404:
 *         description: Meeting not found
 *       500:
 *         description: Error updating meeting
 */
app.patch('/api/meetings/:id', async (req: Request, res: Response) => {
    try {
        const updatedMeeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updatedMeeting) return res.status(404).json({ message: 'Meeting not found' });
        res.status(200).json(updatedMeeting);
    } catch (error) {
        res.status(500).json({ message: 'Error updating meeting' });
    }
});

/**
 * @swagger
 * /api/meetings/{id}:
 *   delete:
 *     summary: Delete a meeting
 *     tags: [Meetings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The meeting id
 *     responses:
 *       200:
 *         description: Meeting successfully deleted
 *       404:
 *         description: Meeting not found
 *       500:
 *         description: Error deleting meeting
 */
app.delete('/api/meetings/:id', async (req: Request, res: Response) => {
    try {
        const deletedMeeting = await Meeting.findByIdAndDelete(req.params.id);
        if (!deletedMeeting) return res.status(404).json({ message: 'Meeting not found' });
        res.status(200).json({ message: 'Meeting successfully deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting meeting' });
    }
});

// --- Swagger Setup ---
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '와인 BYOB 모임 API',
            version: '1.0.0',
            description: '나만의 와인 모임 서비스를 위한 API 문서입니다.',
        },
        servers: [{ url: 'http://localhost:8080' }],
    },
    apis: ['./src/app.ts'], // 개발환경(ts-node) 기준
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
