import express, { Request, Response } from 'express';
import mongoose from 'mongoose'; // 1. mongoose import
import dotenv from 'dotenv'; // 2. dotenv import

dotenv.config(); // 3. .env 파일의 환경 변수를 로드합니다.

const app = express();
const port = 8080;

// 4. MongoDB 연결 문자열 가져오기
const mongoURI = process.env.MONGODB_URI;

// 연결 문자열이 있는지 확인
if (!mongoURI) {
    console.error('오류: MONGODB_URI 환경 변수가 설정되지 않았습니다.');
    process.exit(1); // 오류 발생 시 프로세스 종료
}

// 5. 데이터베이스 연결
mongoose
    .connect(mongoURI)
    .then(() => {
        console.log('✅ MongoDB에 성공적으로 연결되었습니다.');

        // DB 연결 성공 시에만 서버를 시작합니다.
        app.listen(port, () => {
            console.log(`🚀 서버가 http://localhost:${port} 에서 실행 중입니다.`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB 연결에 실패했습니다...', err);
    });

// 기본 라우트는 그대로 둡니다.
app.get('/', (req: Request, res: Response) => {
    res.send('안녕하세요! 와인 BYOB 모임 서버입니다. 🍷');
});
