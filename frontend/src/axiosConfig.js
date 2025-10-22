import axios from "axios";

axios.defaults.baseURL =
  process.env.REACT_APP_SERVER_ENDPOINT || "https://api.sharelift.in";
axios.defaults.withCredentials = true;

export default axios;
