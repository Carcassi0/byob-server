import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Meeting from '../models/Meeting';
import app from '../app'; // 우리가 만든 Express 앱

// 테스트 그룹을 정의합니다.
describe('Meetings API', () => {
    let mongoServer: MongoMemoryServer;

    //모든 테스트가 시작되기 전에 딱 한 번 실행됩니다.
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create(); // 메모리 DB 생성
        const mongoUri = mongoServer.getUri(); // DB 주소 가져오기
        await mongoose.connect(mongoUri); // 메모리 DB에 연결
    });

    //모든 테스트가 끝난 후에 딱 한 번 실행
    afterAll(async () => {
        await mongoose.disconnect(); // DB 연결 해제
        await mongoServer.stop(); // 메모리 DB 중지
    });

    beforeEach(async () => {
        await Meeting.deleteMany({});
    });

    it('새로운 모임을 생성해야 합니다', async () => {
        // 테스트용 모임 데이터
        const newMeetingData = {
            name: 'Jest 테스트 모임',
            wine: '카베르네 소비뇽',
            location: '테스트 장소',
            date: new Date(),
        };

        // 1. supertest를 이용해 POST 요청을 보냅니다.
        const response = await request(app).post('/api/meetings').send(newMeetingData); // 요청 본문에 데이터 첨부

        // 2. 응답을 확인합니다.
        expect(response.statusCode).toBe(201); // 상태 코드가 201 (Created)인지 확인
        expect(response.body.name).toBe('Jest 테스트 모임'); // 응답 데이터의 이름이 일치하는지 확인
        expect(response.body.location).toBe('테스트 장소');
    });

    it('모든 모임 목록을 가져와야 합니다', async () => {
        // 1. 테스트를 위해 먼저 모임 하나를 생성합니다.
        const meetingData = {
            name: 'GET 테스트용 모임',
            wine: '소비뇽 블랑',
            location: '테스트 장소 2',
            date: new Date(),
        };
        // Meeting 모델을 직접 사용해서 DB에 저장
        await new Meeting(meetingData).save();

        // 2. GET 요청을 보냅니다.
        const response = await request(app).get('/api/meetings');

        // 3. 응답을 확인합니다.
        expect(response.statusCode).toBe(200); // 상태 코드는 200 (OK)
        expect(Array.isArray(response.body)).toBe(true); // 응답이 배열인지 확인
        expect(response.body.length).toBeGreaterThan(0); // 배열에 데이터가 1개 이상 있는지 확인
        expect(response.body[0].name).toBe('GET 테스트용 모임'); // 데이터 내용 확인
    });

    it('특정 모임을 수정해야 합니다', async () => {
        const meeting = await new Meeting({
            name: '수정 전 모임',
            wine: 'Domaine Huet, Le Haut Lieux 2012',
            location: '수정 전 장소',
            date: new Date(),
        }).save();

        const newLocation = '수정 완료된 장소';

        const response = await request(app)
            .patch(`/api/meetings/${meeting._id}`)
            .send({ location: newLocation });

        expect(response.statusCode).toBe(200);
        expect(response.body.location).toBe(newLocation);
        expect(response.body.name).toBe('수정 전 모임');
    });

    it('특정 모임을 삭제해야 합니다', async () => {
        // 삭제를 위한 테스트용 모임을 하나 생성합니다.
        const meeting = await new Meeting({
            name: '삭제될 모임',
            wine: '리슬링',
            location: '사라질 장소',
            date: new Date(),
        }).save();

        // DELETE 요청으로 모임을 삭제합니다.
        const response = await request(app).delete(`/api/meetings/${meeting._id}`); // URL에 모임의 고유 ID를 포함

        // 응답을 확인합니다.
        expect(response.statusCode).toBe(200); // 상태 코드는 200 (OK)
        expect(response.body.message).toBe('모임이 성공적으로 삭제되었습니다.');

        //  실제로 DB에서 삭제되었는지 다시 한번 확인합니다.
        const deletedMeeting = await Meeting.findById(meeting._id);
        expect(deletedMeeting).toBeNull(); // findById 결과가 null이어야 함
    });
});
