/**
 * osmPaths.json → olleTrails.js 경로 좌표 적용
 * path 블록만 텍스트 치환 (다른 필드 그대로 유지)
 * node scripts/applyOsmPaths.cjs
 */

const fs = require('fs');
const path = require('path');

const osmPathsFile = path.join(__dirname, 'osmPaths.json');
const olleTrailsFile = path.join(__dirname, '../src/data/olleTrails.js');

function buildPathBlock(pts) {
  const inner = pts
    .map((p) => `      { lat: ${p.lat}, lng: ${p.lng} }`)
    .join(',\n');
  return `path: [\n${inner}\n    ]`;
}

function main() {
  const osmPaths = JSON.parse(fs.readFileSync(osmPathsFile, 'utf8'));
  console.log(`osmPaths.json: ${Object.keys(osmPaths).length}개 코스\n`);

  let src = fs.readFileSync(olleTrailsFile, 'utf8');
  let updated = 0;

  for (const [appIdStr, pts] of Object.entries(osmPaths)) {
    const appId = parseInt(appIdStr);

    // id: <appId>, 블록 찾기
    // 해당 id 블록 안에서 path: [ ... ] 를 새 좌표로 교체
    // 전략: id: N, 이후 다음 id: M, 이전까지의 구간에서 path: [...] 교체

    // id 블록 경계 찾기
    const idPattern = new RegExp(`(\\bid\\s*:\\s*${appId}\\b[\\s\\S]*?)path\\s*:\\s*\\[([\\s\\S]*?)\\](?=\\s*[,}])`, '');
    const match = src.match(idPattern);
    if (!match) {
      console.log(`  ⚠ id=${appId}: path 블록 찾기 실패`);
      continue;
    }

    const newPathBlock = buildPathBlock(pts);
    src = src.replace(idPattern, `$1${newPathBlock}`);
    updated++;
    console.log(`  ✅ id=${appId}: ${pts.length}개 좌표 적용`);
  }

  fs.writeFileSync(olleTrailsFile, src, 'utf8');
  console.log(`\n✅ 완료 — ${updated}개 코스 OSM 경로 적용`);
}

main();
