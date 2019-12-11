const prodHost = window.location.origin + window.location.pathname.substring(0, window.location.pathname.length - 1);
const devHost = 'http://localhost:8080';

const Config = {
  api: {
    host: window.location.origin === 'http://localhost:9000' ? devHost : prodHost
  }
};

export default Config;
