import json
import urllib.parse

import requests
from wasmer import Store, Function, Module, Instance


wasm = None
memory_p = None
memory_h = None

p = 'J6XuCcCtPfVdSv6YUls4Jg=='
h = '10011'


def getPlayerVersion():
    url = 'https://app-sc.miguvideo.com/common/v1/settings/H5_DetailPage'
    paramValue = requests.get(url).json()['body']['paramValue']
    playerVersion = json.loads(paramValue)['playerVersion']
    return playerVersion

# 定义wasm的导入函数
def a(e: int, t: int, r: int, n: int) -> int:
    s = 0
    for i in range(r):
        d = memory_h[t + 4 >> 2]
        t += 8
        s += d
    memory_h[n >> 2] = s
    return 0

def b(e: int, t: int, r: int, n: int): pass
def c(e: int) -> int: pass

def d() -> int:
    return 1


def initWasm():
    global wasm

    playerVersion = getPlayerVersion()
    wasm_url = f'https://www.miguvideo.com/mgs/player/prd/{playerVersion}/dist/mgprtcl.wasm'
    wasm_binary = requests.get(wasm_url).content

    store = Store()
    module = Module(store, wasm_binary)

    import_obj = {
        'a': {
            'b': Function(store, b),
            'c': Function(store, c),
            'a': Function(store, a),
            'd': Function(store, d),
        },
    }
    wasm = Instance(module, import_obj)


def stringToUTF8(string: str, offset: int, length: int):
    for i, c in enumerate(string.encode('utf-8')):
        memory_p[offset+i] = c
    return len(string)


def UTF8ToString(offset: int) -> str:
    s = ''
    while memory_p[offset]:
        s += chr(memory_p[offset])
        offset += 1
    return s


def encrypt(url: str):
    query = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)
    o = query.get('userid', [''])[0]
    a = query.get('timestamp', [''])[0]
    s = query.get('ProgramID', [''])[0]
    l = query.get('Channel_ID', [''])[0]
    g = query.get('puData', [''])[0]

    f = malloc(len(o)+1)
    d = malloc(len(a)+1)
    v = malloc(len(s)+1)
    m = malloc(len(l)+1)
    b = malloc(len(g)+1)
    _ = malloc(len(p)+1)

    E = malloc(64)
    T = malloc(128)
    w = malloc(128)

    stringToUTF8(o, f, len(o)+1)
    stringToUTF8(a, d, len(a)+1)
    stringToUTF8(s, v, len(s)+1)
    stringToUTF8(l, m, len(l)+1)
    stringToUTF8(g, b, len(g)+1)
    stringToUTF8(p, _, len(p)+1)

    S = CallInterface6()
    CallInterface1(S, v, len(s))
    CallInterface10(S, d, len(a))
    CallInterface9(S, f, len(o))
    CallInterface3(S, 0, 0)
    CallInterface11(S, 0, 0)
    CallInterface8(S, b, len(g))
    CallInterface2(S, m, len(l))
    CallInterface14(S, _, len(p), w, 128)

    I = UTF8ToString(w)
    O = malloc(len(I)+1)

    stringToUTF8(I, O, len(I)+1)
    CallInterface7(S, O, len(I))
    CallInterface4(S, T, 128)
    k = UTF8ToString(T)

    return url + '&ddCalcu=' + k + '&sv=' + h


def getUrl(vid, rate_type=3):
    channel_id = '0132_10010001005'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4343.0 Safari/537.36 Edg/89.0.727.0',
        'Appcode': 'miguvideo_default_www',
        'Appid': 'miguvideo',
        'Channel': 'H5',
        'x-up-client-channel-id': channel_id,
    }
    url = f'https://webapi.miguvideo.com/gateway/playurl/v3/play/playurl?contId={vid}&rateType={rate_type}&xh265=true&chip=mgwww&channelId={channel_id}'

    resp = requests.get(url, headers=headers)
    video_url = resp.json()['body']['urlInfo']['url']
    return video_url


# 初始化wasm并获取其导出函数及虚拟机内存视图
initWasm()
CallInterface1 = wasm.exports.i
CallInterface2 = wasm.exports.j
CallInterface3 = wasm.exports.k
CallInterface4 = wasm.exports.l
CallInterface6 = wasm.exports.n
CallInterface7 = wasm.exports.o
CallInterface8 = wasm.exports.p
CallInterface9 = wasm.exports.q
CallInterface10 = wasm.exports.r
CallInterface11 = wasm.exports.s
CallInterface14 = wasm.exports.u
malloc = wasm.exports.v

memory = wasm.exports.e
memory_p = memory.uint8_view()
memory_h = memory.uint32_view()


def main():
    videoId = 722208612
    print(f'获取视频{videoId}的加密链接')
    videoUrl = getUrl(videoId)
    encryptedUrl = encrypt(videoUrl)
    print(encryptedUrl)


if __name__ == '__main__':
    main()
