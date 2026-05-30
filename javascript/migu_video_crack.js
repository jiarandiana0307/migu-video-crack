let wasmInstance = null;
let CallInterface1 = null;
let CallInterface2 = null;
let CallInterface3 = null;
let CallInterface4 = null;
let CallInterface6 = null;
let CallInterface7 = null;
let CallInterface8 = null;
let CallInterface9 = null;
let CallInterface10 = null;
let CallInterface11 = null;
let CallInterface14 = null;
let malloc = null

let memory = null;
let memory_p = null;
let memory_h = null;

const p = '+6e7/UkVh9XuFSTC5k08Qw==';
const h = '10012';

function stringToUTF8(string, offset, length) {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(string);
    for (let i = 0; i < encoded.length && i < length - 1; i++) {
        memory_p[offset + i] = encoded[i];
    }
    memory_p[offset + encoded.length] = 0; // Null-terminate
    return encoded.length;
}

function UTF8ToString(offset) {
    let s = '';
    let i = 0;
    while (memory_p[offset + i]) {
        s += String.fromCharCode(memory_p[offset + i]);
        i++;
    }
    return s;
}

async function getPlayerVersion() {
    // 获取最新的mgprtcl.wasm文件版本，此文件用于对视频URL进行加密
    // const response = await fetch('https://app-sc.miguvideo.com/common/v1/settings/H5_DetailPage');
    // const data = await response.json();
    // const paramValue = data.body.paramValue;
    // const playerVersion = JSON.parse(paramValue).playerVersion;

    // 2026.03.02更新了版本v_20260302144246_07e30d7c
    // 如果使用最新的版本，则此脚本已无法运行。但其实
    // 视频URL底层的加密算法没变，所以这里仍然可以使用
    // 上一版本的mgprtcl.wasm文件对视频URL进行加密
    const playerVersion = 'v_20251124155500_63c16e66';
    return playerVersion;
}

// WASM导入函数
function a(e, t, r, n) {
    let s = 0;
    for (let i = 0; i < r; i++) {
        const d = memory_h[t + 4 >> 2];
        t += 8;
        s += d;
    }
    memory_h[n >> 2] = s;
    return 0;
}
function b(e, t, r, n) {}
function c(e) {}
function d() { return 1; }

async function initWasm() {
    const playerVersion = await getPlayerVersion();
    const wasmUrl = `https://www.miguvideo.com/mgs/player/prd/${playerVersion}/dist/mgprtcl.wasm`;
    
    const response = await fetch(wasmUrl);
    const wasmBinary = await response.arrayBuffer();
    
    const importObject = {
        a: {
            b: b,
            c: c,
            a: a,
            d: d,
        },
    };
    
    const { instance } = await WebAssembly.instantiate(wasmBinary, importObject);
    wasmInstance = instance;
    
    // 设置内存视图
    memory = wasmInstance.exports.e;
    memory_p = new Uint8Array(memory.buffer);
    memory_h = new Uint32Array(memory.buffer);
    
    // 分配导出函数
    CallInterface1 = wasmInstance.exports.i;
    CallInterface2 = wasmInstance.exports.j;
    CallInterface3 = wasmInstance.exports.k;
    CallInterface4 = wasmInstance.exports.l;
    CallInterface6 = wasmInstance.exports.n;
    CallInterface7 = wasmInstance.exports.o;
    CallInterface8 = wasmInstance.exports.p;
    CallInterface9 = wasmInstance.exports.q;
    CallInterface10 = wasmInstance.exports.r;
    CallInterface11 = wasmInstance.exports.s;
    CallInterface14 = wasmInstance.exports.u;
    malloc = wasmInstance.exports.v;
}

function encrypt(url) {
    const parsedUrl = new URL(url);
    const query = Object.fromEntries(new URLSearchParams(parsedUrl.search));

    const o = query.userid || '';
    const a = query.timestamp || '';
    const s = query.ProgramID || '';
    const l = query.Channel_ID || '';
    const g = query.puData || '';

    const f = malloc(o.length + 1);
    const d = malloc(a.length + 1);
    const v = malloc(s.length + 1);
    const m = malloc(l.length + 1);
    const b = malloc(g.length + 1);
    const _ = malloc(p.length + 1);

    const E = malloc(64);
    const T = malloc(128);
    const w = malloc(128);

    stringToUTF8(o, f, o.length + 1);
    stringToUTF8(a, d, a.length + 1);
    stringToUTF8(s, v, s.length + 1);
    stringToUTF8(l, m, l.length + 1);
    stringToUTF8(g, b, g.length + 1);
    stringToUTF8(p, _, p.length + 1);

    const S = CallInterface6();
    CallInterface1(S, v, s.length);
    CallInterface10(S, d, a.length);
    CallInterface9(S, f, o.length);
    CallInterface3(S, 0, 0);
    CallInterface11(S, 0, 0);
    CallInterface8(S, b, g.length);
    CallInterface2(S, m, l.length);
    CallInterface14(S, _, p.length, w, 128);

    const I = UTF8ToString(w);
    const O = malloc(I.length + 1);

    stringToUTF8(I, O, I.length + 1);
    CallInterface7(S, O, I.length);
    CallInterface4(S, T, 128);
    const k = UTF8ToString(T);

    return url + '&ddCalcu=' + encodeURIComponent(k) + '&sv=' + h;
}

async function getUrl(vid, rate_type = 3) {
    const channel_id = '0132_10010001005';
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4343.0 Safari/537.36 Edg/89.0.727.0',
        'Appcode': 'miguvideo_default_www',
        'Appid': 'miguvideo',
        'Channel': 'H5',
        'x-up-client-channel-id': channel_id,
    };
    
    const url = `https://webapi.miguvideo.com/gateway/playurl/v3/play/playurl?contId=${vid}&rateType=${rate_type}&xh265=true&chip=mgwww&channelId=${channel_id}`;
    
    const response = await fetch(url, { headers });
    const data = await response.json();
    return data.body.urlInfo.url;
}

// 示例使用
await initWasm();
const videoId = 722208612;
getUrl(videoId).then(url => {
    console.log(`获取视频${videoId}的加密链接`);
    const encryptedUrl = encrypt(url);
    console.log("加密后的URL:", encryptedUrl);
});
