import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app'; // app.ts에서 만든 앱을 가져옵니다.

dotenv.config();

const port = process.env.PORT || 8080;
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.error('오류: MONGODB_URI 환경 변수가 설정되지 않았습니다.');
    process.exit(1);
}

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
