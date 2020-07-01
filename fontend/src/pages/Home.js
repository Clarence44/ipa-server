import React, { useState, useEffect, useRef } from 'react';
import '../styles/App.less';
// import '../../../lib/papa';
import utils from '../utils/utils';
// import http from '../utils/http';
import 'weui';
import { alert } from 'weui.js';
import { useSelector, useDispatch } from 'react-redux';
import List from '../components/List';
import { changePlatform } from '../redux';

function getApiUrl(path) {
  console.log(path);
  if (window.localStorage.getItem('ACCESS_KEY')) {
    return (
      path +
      (path.indexOf('?') >= 0 ? '&' : '?') + 
      'key=' +
      window.localStorage.getItem('ACCESS_KEY') +
      `&v=${parseInt(new Date().getTime() / 1000)}`
    );
  }
  return path;
}

function updateAddProgress(progress, setWords) {
  if (progress === 0) {
    setWords(utils.langString('Add'));
  } else if (progress === 1) {
    setWords(utils.langString('Upload Done!'));
    setTimeout(() => {
      setWords(utils.langString('Add'));
    }, 2000);
  } else {
    setWords(`${(progress * 100).toFixed(2)}%`);
  }
}

function App(props) {
  const [list, setList] = useState([]);
  const state = useSelector((state) => state);
  let dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [words, setWords] = useState(utils.langString('Upload'));

  const btnRef = useRef();

  useEffect(() => {
    getList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.platform]);

  const getList = () => {
    utils.fetch(getApiUrl(`/api/list?p=${state.platform}`)).then((list) => {
      setList(list);
    });
  };

  const handleUpload = (e) => {
    if (e.target.files.length === 0) {
      return;
    }
    const data = new FormData();
    data.append('file', e.target.files[0]);
    setUploading(true);
    utils
      .fetch(
        getApiUrl('/api/upload'),
        {
          method: 'POST',
          body: data,
        },
        (progress) => {
          updateAddProgress(progress.loaded / progress.total, setWords);
        }
      )
      .then((json) => {
        e.target.value = '';
        setUploading(false);
        if (json.err) {
          alert(json.err);
          return;
        }
        getList();
      })
      .catch((err) => {
        setUploading(false);
        updateAddProgress(0, setWords);
      });
  };

  const Tabs = (props) => {
    return (
      <div className="tabs">
        {['Android', 'ios'].map((item) => (
          <div
            className={item === state.platform ? 'tab on' : 'tab'}
            key={item}
            onClick={() => {
              dispatch(changePlatform(item));
            }}
          >
            {utils.langString(item)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <form style={{ display: utils.isPC ? 'flex' : 'none' }}>
        <input
          className="file"
          type="file"
          name="file"
          value=""
          ref={btnRef}
          accept=".ipa, .apk"
          onChange={handleUpload}
        />
        <div className="add-btn">
          <Tabs />
          <div
            className="button"
            onClick={() => {
              uploading || btnRef.current.click();
            }}
          >
            {words}
          </div>
        </div>
      </form>
      <div id="list">
        {list.map((row) => (
          <List data={row} key={row.id} />
        ))}
      </div>
    </>
  );
}
export default App;
