import axios from "axios";

axios.defaults.baseURL =
  process.env.REACT_APP_SERVER_ENDPOINT ||
  "https://sharelift-backend1-557676259557.asia-south1.run.app";
axios.defaults.withCredentials = true; // ensures cookies (tokens) are sent with requests

export default axios;
