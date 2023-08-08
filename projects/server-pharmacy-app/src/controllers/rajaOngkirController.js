const axios = require("axios");

axios.defaults.baseURL = "https://api.rajaongkir.com/starter";
// axios.defaults.headers.common["key"] = "320acd50980f82992b48f72f61c2aff0";
axios.defaults.headers.common["key"] = "a65df26a87e418bf200bb23388446db0";
// axios.defaults.headers.common["key"] = "873d4124b551d27c149cd5f643f470f5";
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

module.exports = {
  province: async (req, res) => {
    try {
      const province = await axios.get("/province");
      if (province.data.rajaongkir.status.code === 200) {
        return res.status(200).send({
          success: true,
          province: province.data.rajaongkir.results,
        });
      } else {
        return res
          .status(200)
          .send({ success: false, message: "Fail to Fetch Province" });
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  city: async (req, res) => {
    try {
      const id = req.params.provId;
      const city = await axios.get(`/city?province=${id}`);
      if (city.data.rajaongkir.status.code === 200) {
        return res
          .status(200)
          .send({ success: true, city: city.data.rajaongkir.results });
      } else {
        return res
          .status(200)
          .send({ success: false, message: "Fail to Fetch City" });
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  cost: async (req, res) => {
    try {
      const { origin, destination, weight, courier } = req.body;
      const cost = await axios.post(`/cost`, {
        origin,
        destination,
        weight,
        courier,
      });
      if (cost.data.rajaongkir.status.code === 200) {
        return res.status(200).send({
          success: true,
          message: "fetching success",
          services: cost.data.rajaongkir.results[0].costs,
        });
      } else {
        return res.status(200).send({
          success: false,
          message: cost.data.rajaongkir.status.description,
        });
      }
    
    } catch (error) {
      return res.status(400).send(error);
    }
  },
};
