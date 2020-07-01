import React from 'react';
import '../styles/App.less';
import utils from '../utils/utils';
import { withRouter } from 'react-router-dom';

function List(props) {
  const { data } = props;
  return (
    <div
      className="row"
      onClick={() => {
        props.history.push(`/app?id=${data.id}`);
        // window.location.reload();
      }}
    >
      <img src={data.webIcon} alt="" />
      <div className="center">
        <div className="name">
          {data.name}
          {data.current ? (
            <span className="tag">{utils.langString('Current')}</span>
          ) : (
            ''
          )}
        </div>
        <div className="version">
          <span>
            {data.version}(Build {data.build})
          </span>
          <span>
            {(data.channel &&
              utils.langString('Channel') + ': ' + data.channel) ||
              ''}
          </span>
        </div>
        <div className="date">
          {utils.langString('Upload Date: ')}
          {data.date}
        </div>
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          utils.onClickInstall(data);
        }}
        className="right"
      >
        {utils.langString('Download')}
      </div>
    </div>
  );
}
export default withRouter(List);
