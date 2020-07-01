import React, { useRef, useEffect, useState } from 'react';
import '../styles/App.less';
import utils from '../utils/utils';
import QRCode from 'qrcode';
import List from '../components/List';
import { withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { changePlatform } from '../redux';

function createQRCode(ele) {
  // create qrcode
  QRCode.toCanvas(ele, window.location.href, {
    width: 256,
    height: 256,
    colorDark: '#000000',
    colorLight: '#ffffff',
    errorCorrectionLevel: 'H',
  });
}

function query() {
  const obj = {};
  window.location.search
    .split('?')[1]
    .split('&')
    .forEach((row) => {
      const v = row.split('=');
      if (v.length === 2) {
        obj[v[0]] = v[1];
      }
    });
  return obj;
}

function App(props) {
  const [appData, setAppData] = useState({});
  const [list, setList] = useState([]);
  const canvasRef = useRef();
  const id = query().id || '';
  const state = useSelector((state) => state);
  let dispatch = useDispatch();

  useEffect(() => {
    if (!utils.isPC) {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        dispatch(changePlatform('IOS'));
      } else {
        dispatch(changePlatform('Android'));
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, state.platform]);

  const getData = () => {
    utils
      .fetch(
        `/api/info?id=${id}&v=${parseInt(
          new Date().getTime() / 1000
        )}&p=${state.platform}`
      )
      .then((row) => {
        if (!row.history) {
          setAppData({});
          setList([]);
          return;
        }
        setAppData(row);
        setList(row.history);
        createQRCode(canvasRef.current);
      });
  };

  const Tabs = (props) => {
    return (
      <div className="tabs">
        {['Android', 'IOS'].map((item) => (
          <div
            className={item === state.platform ? 'tab on' : 'tab'}
            onClick={() => {
              dispatch(changePlatform(item));
            }}
            key={item}
          >
            {utils.langString(item)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div key={state.platform}>
      <div
        className="plat-tab"
        style={{ display: utils.isPC ? 'block' : 'none' }}
      >
        <Tabs />
      </div>
      <div id="info">
        <img className="icon" src={appData.webIcon} alt="" />
        <div className="name">{appData.name}</div>
        <div>
          {(appData.channel &&
            utils.langString('Channel') + ': ' + appData.channel) ||
            ''}
        </div>
        <div>
          {utils.langString('Beta')} - {appData.version}(Build {appData.build})
          -{utils.sizeStr(appData.size)}
        </div>
        <div className="date">
          {utils.langString('Upload Date: ')}
          {appData.date}
        </div>
        <div className="qrcode">
          <canvas ref={canvasRef}></canvas>
        </div>
        <div onClick={() => utils.onClickInstall(appData)} className="install">
          {utils.langString('Download and Install')}
        </div>
      </div>
      <div id="list">
        {list.map((row) => (
          <List data={row} key={row.id} />
        ))}
      </div>
    </div>
  );
}
export default withRouter(App);
