import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const styles = {
  background: 'rgba(0, 0, 0, 0.8)',
  color: '#FFFFFF',
  fontSize: '14px',
  lineHeight: '20px',
  padding: '12px 16px',
  borderRadius: '4px',
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  WebkitTransform: 'translate(-50%, -50%)',
  MozTransform: 'translate(-50%, -50%)',
  OTransform: 'translate(-50%, -50%)',
  msTransform: 'translate(-50%, -50%)',
  zIndex: 9999,
  transition: 'opacity 0.5s',
  opacity: 0,
};
const onshow = {
  opacity: 1,
};

const Toast = (props) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, props.duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={show ? { ...styles, ...onshow } : styles}>{props.message}</div>
  );
};

const toast = (content = '', options = {}) => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  if (typeof options === 'number') {
    options = {
      duration: options,
    };
  }
  if (typeof options === 'function') {
    options = {
      callback: options,
    };
  }
  const option = Object.assign(
    { content: content, duration: 3000, callback: () => {} },
    options
  );
  ReactDOM.render(
    <Toast duration={option.duration} message={option.content} />,
    div
  );
  setTimeout(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
    option.callback();
  }, option.duration + 500);
};

export default toast;
