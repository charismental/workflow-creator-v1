import axios from "axios";

const headers = {};

export default axios.create({ baseURL: process.env.BASE_URL });
