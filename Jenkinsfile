pipeline {
    agent any
    
    environment {
        // 배포 경로 설정
        DEPLOY_PATH = '/home/ubuntu/nginx/html'
    }
    
    tools {
        nodejs 'node18'  // Jenkins에서 설정한 NodeJS 이름과 일치해야 함
    }
    
    stages {
        stage('Prepare') {
            steps {
                // 버전 확인
                sh '''
                    node --version
                    npm --version
                '''
                
                // 기존 node_modules 제거 (캐시 클린)
                sh 'rm -rf node_modules'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                // 의존성 설치
                sh 'npm install'
            }
        }
        
        stage('Build') {
            steps {
                // Vite 프로젝트 빌드
                sh 'npm run build'
            }
        }
        
        stage('Deploy') {
            steps {
                // 기존 파일 제거 및 새 파일 복사
                sh '''
                    # 기존 파일 제거
                    rm -rf ${DEPLOY_PATH}/*
                    
                    # 빌드 결과물 복사 (Vite는 기본적으로 dist 폴더에 생성)
                    cp -r dist/* ${DEPLOY_PATH}/
                '''
            }
        }
    }
    
    post {
        always {
            // 작업 디렉토리 정리
            cleanWs()
        }
    }
}