import axios from "axios";

const headers = {};

export default axios.create({ baseURL: process.env.REACT_APP_BASE_URL });
