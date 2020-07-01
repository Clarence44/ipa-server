// fetch with progress
export function fetch(url, opts = {}, onProgress) {
  return new Promise((res, rej) => {
    var xhr = new XMLHttpRequest();
    xhr.open(opts.method || 'get', url);
    for (var k in opts.headers || {}) xhr.setRequestHeader(k, opts.headers[k]);
    xhr.onload = (e) => res(JSON.parse(e.target.responseText));
    xhr.onerror = rej;
    if (xhr.upload && onProgress) xhr.upload.onprogress = onProgress;
    xhr.send(opts.body);
  });
}

// return true if is PC
export function isPC() {
  const Agents = [
    'Android',
    'iPhone',
    'SymbianOS',
    'Windows Phone',
    'iPad',
    'iPod',
  ];
  for (let v = 0; v < Agents.length; v++) {
    if (window.navigator.userAgent.indexOf(Agents[v]) > 0) {
      return false;
    }
  }
  return true;
}

export function language() {
  return navigator.language || navigator.browserLanguage;
}

// set locale for server
document.cookie = `locale=${language()};`;

// localization string
export function langString(key) {
  const localStr = {
    goBack: {
      'zh-cn': '返回',
    },
    Android: {
      'zh-cn': '安卓',
    },
    IOS: {
      'zh-cn': '苹果',
    },
    Upload: {
      'zh-cn': '上传',
    },
    Download: {
      'zh-cn': '下载',
    },
    'Upload Date: ': {
      'zh-cn': '更新时间：',
    },
    Add: {
      'zh-cn': '添加',
    },
    'Upload Done!': {
      'zh-cn': '上传成功！',
    },
    'Download and Install': {
      'zh-cn': '下载安装',
    },
    Beta: {
      'zh-cn': '内测版',
    },
    Current: {
      'zh-cn': '当前',
    },
    Channel: {
      'zh-cn': '渠道',
    },
  };
  const lang = localStr[key][language().toLowerCase()];
  return lang ? lang : key;
}

// bytes to Human-readable string
export function sizeStr(size) {
  const K = 1024,
    M = 1024 * K,
    G = 1024 * M;
  if (size > G) {
    return `${(size / G).toFixed(2)} GB`;
  } else if (size > M) {
    return `${(size / M).toFixed(2)} MB`;
  } else {
    return `${(size / K).toFixed(2)} KB`;
  }
}

export const onClickInstall = (row) => {
  if (row.platform === 'IOS') {
    window.location.href =
      'itms-services://?action=download-manifest&url=' + row.plist;
  } else {
    window.location.href = row.apk;
  }
};

export default {
  fetch,
  isPC: isPC(),
  langString,
  sizeStr,
  onClickInstall,
};
