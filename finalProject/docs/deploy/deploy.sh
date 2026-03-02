#!/bin/bash

# =============================================
# HONDI 배포 스크립트
# 사용법:
#   ./deploy.sh        → 프론트 + 백엔드 전체 배포
#   ./deploy.sh back   → 백엔드만 배포
#   ./deploy.sh front  → 프론트만 배포
# =============================================

PEM="/c/Users/User/OneDrive - 한양사이버대학교/바탕 화면/내 문서/KH수업자료/파이널프로젝트/changsik.pem"
EC2="ec2-user@52.78.65.4"
PROJECT_ROOT="/c/workspace/final_project/finalProject"
MODE=${1:-all}  # 인자 없으면 전체 배포

echo "=========================================="
echo " HONDI 배포 시작 [모드: $MODE]"
echo "=========================================="

# ---------- 프론트엔드 빌드 & 업로드 ----------
deploy_front() {
  echo ""
  echo "[1/2] 프론트엔드 빌드 중..."
  cd "$PROJECT_ROOT/fronted"
  npm run build
  if [ $? -ne 0 ]; then
    echo "❌ 프론트엔드 빌드 실패"
    exit 1
  fi

  echo "[1/2] 프론트엔드 EC2 업로드 중..."
  ssh -i "$PEM" -o StrictHostKeyChecking=no "$EC2" "rm -rf /home/ec2-user/dist && mkdir -p /home/ec2-user/dist"
  scp -i "$PEM" -o StrictHostKeyChecking=no -r \
    "$PROJECT_ROOT/fronted/dist/." \
    "$EC2:/home/ec2-user/dist/"
  ssh -i "$PEM" -o StrictHostKeyChecking=no "$EC2" "chmod -R o+rx /home/ec2-user/dist"
  echo "✅ 프론트엔드 배포 완료"
}

# ---------- 백엔드 빌드 & 업로드 & 재시작 ----------
deploy_back() {
  echo ""
  echo "[2/2] 백엔드 빌드 중..."
  cd "$PROJECT_ROOT/backend"
  ./gradlew clean build -x test
  if [ $? -ne 0 ]; then
    echo "❌ 백엔드 빌드 실패"
    exit 1
  fi

  echo "[2/2] 백엔드 JAR EC2 업로드 중..."
  scp -i "$PEM" -o StrictHostKeyChecking=no \
    "$PROJECT_ROOT/backend/build/libs/backend-0.0.1-SNAPSHOT.jar" \
    "$EC2:/home/ec2-user/"

  echo "[2/2] Spring Boot 재시작 중..."
  ssh -i "$PEM" -o StrictHostKeyChecking=no "$EC2" "
    PID=\$(cat /home/ec2-user/app.pid 2>/dev/null)
    if [ ! -z \"\$PID\" ]; then
      kill \$PID 2>/dev/null
      sleep 3
    fi
    nohup java -jar /home/ec2-user/backend-0.0.1-SNAPSHOT.jar \
      > /home/ec2-user/app.log 2>&1 &
    echo \$! > /home/ec2-user/app.pid
    echo '✅ Spring Boot 재시작 완료 (PID:' \$(cat /home/ec2-user/app.pid) ')'
  "
}

# ---------- 모드별 실행 ----------
case $MODE in
  front)
    deploy_front
    ;;
  back)
    deploy_back
    ;;
  all|*)
    deploy_front
    deploy_back
    ;;
esac

echo ""
echo "=========================================="
echo " 배포 완료!"
echo "=========================================="
