/**
 * Jeju Olle Trail GPS 데이터 수집 → osmPaths.json 저장
 * node scripts/fetchOlleOsm.cjs
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ── OSM relation ID → olleTrails.js 내 appId 매핑 ──
// 신규 추가: 8코스(7248520), 9코스(7248521), 10코스(7248522), 11코스(7248523)
//            14코스(6107767), 20코스(5535857), 21코스(5539069)
const OSM_MAPPING = [
  { relId: 7248520, appId: 10, label: '8코스' },
  { relId: 7248521, appId: 11, label: '9코스' },
  { relId: 7248522, appId: 12, label: '10코스' },
  { relId: 7248523, appId: 14, label: '11코스' },
  { relId: 6107767, appId: 17, label: '14코스' },
  { relId: 5535857, appId: 25, label: '20코스' },
  { relId: 5539069, appId: 26, label: '21코스' },
  { relId: 9180869, appId: 25, label: '20코스(rcn)' }, // 중복 시 덮어씀
  { relId: 9149294, appId: 20, label: '16코스' },
  { relId: 9149293, appId: 21, label: '17코스' },
  { relId: 9149725, appId: 22, label: '18코스' },
  { relId: 9173551, appId: 24, label: '19코스' },
  { relId: 9180869, appId: 25, label: '20코스' },
];

function overpassQuery(q) {
  return new Promise((resolve, reject) => {
    const body = `data=${encodeURIComponent(q)}`;
    const options = {
      hostname: 'overpass-api.de',
      path: '/api/interpreter',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('JSON parse error: ' + data.slice(0, 300))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(120000, () => req.destroy(new Error('timeout')));
    req.write(body);
    req.end();
  });
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function dist(a, b) {
  return Math.hypot(a.lat - b.lat, (a.lon ?? a.lng) - (b.lon ?? b.lng));
}

function chainWays(ways) {
  const valid = ways.filter((w) => w.geometry && w.geometry.length >= 2);
  if (valid.length === 0) return [];
  const result = [...valid[0].geometry];
  for (let i = 1; i < valid.length; i++) {
    const geo = valid[i].geometry;
    const last = result[result.length - 1];
    if (dist(last, geo[0]) <= dist(last, geo[geo.length - 1])) {
      result.push(...geo.slice(1));
    } else {
      result.push(...[...geo].reverse().slice(1));
    }
  }
  return result;
}

function ptLineDist(p, a, b) {
  const dx = b.lat - a.lat, dy = (b.lon ?? b.lng) - (a.lon ?? a.lng);
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return dist(p, a);
  const t = Math.max(0, Math.min(1, ((p.lat - a.lat) * dx + ((p.lon ?? p.lng) - (a.lon ?? a.lng)) * dy) / len2));
  return Math.hypot(p.lat - (a.lat + t * dx), (p.lon ?? p.lng) - ((a.lon ?? a.lng) + t * dy));
}

function douglasPeucker(pts, eps) {
  if (pts.length <= 2) return pts;
  let maxD = 0, maxI = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = ptLineDist(pts[i], pts[0], pts[pts.length - 1]);
    if (d > maxD) { maxD = d; maxI = i; }
  }
  if (maxD > eps) {
    return [...douglasPeucker(pts.slice(0, maxI + 1), eps).slice(0, -1),
            ...douglasPeucker(pts.slice(maxI), eps)];
  }
  return [pts[0], pts[pts.length - 1]];
}

async function main() {
  console.log('=== 올레길 OSM GPS 수집 ===\n');
  const osmPaths = {};

  for (const { relId, appId, label } of OSM_MAPPING) {
    process.stdout.write(`[${label}] relation ${relId}... `);
    try {
      const result = await overpassQuery(
        `[out:json][timeout:90];relation(${relId});out geom;`
      );
      const rel = result.elements.find((e) => e.type === 'relation');
      if (!rel?.members) { console.log('❌ 없음'); continue; }

      const ways = rel.members.filter((m) => m.type === 'way' && m.geometry?.length >= 2);
      if (ways.length === 0) { console.log('❌ way 없음'); continue; }

      const chained = chainWays(ways);
      const simplified = douglasPeucker(chained, 0.00015);
      osmPaths[appId] = simplified.map((p) => ({ lat: p.lat, lng: p.lon }));
      console.log(`✅ ${chained.length}pts → ${simplified.length}pts`);

      await sleep(700);
    } catch (e) {
      console.log(`❌ ${e.message}`);
    }
  }

  const outFile = path.join(__dirname, 'osmPaths.json');
  fs.writeFileSync(outFile, JSON.stringify(osmPaths, null, 2));
  console.log(`\n완료: ${Object.keys(osmPaths).length}개 코스`);
  console.log(`저장: ${outFile}`);
  console.log('다음: node scripts/applyOsmPaths.cjs');
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
