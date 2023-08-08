import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCity } from "../../features/rajaongkir/rajaongkirSlice";
import { useDispatch } from "react-redux";
import {
  addUserAddress,
  fetchProvince,
} from "../../features/users/addressSlice";

function AddressModal() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [provinceId, setProvinceId] = useState("");
  const [city, setCityId] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [type, setType] = useState("");
  const provinces = useSelector((state) => state.address.provinces);
  const cities = useSelector((state) => state.rajaongkir.city);

  const renderProvince = () => {
    return provinces.map((province, index) => {
      return (
        <option key={index} value={province.province_id}>
          {province.province}
        </option>
      );
    });
  };
  const renderCity = () => {
    return cities.map((city, index) => {
      return (
        <option key={index} value={JSON.stringify(city)}>
          {city.type} {city.city_name}
        </option>
      );
    });
  };
  const addAddress = () => {
    dispatch(
      addUserAddress(
        city,
        provinceId,
        street,
        isPrimary,
        district,
        postalCode,
        type
      )
    );
    setOpen(false);
  };
  useEffect(() => {
    dispatch(fetchProvince());
    dispatch(getCity(provinceId));
  }, [provinceId]);

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="border-2 border-green-300  font-bold py-2 px-4 rounded-md hover:bg-emerald-500 hover:text-white text-emerald-500"
        >
          Add Address
        </button>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center ">
          <div className=" bg-white py-3 lg:px-14 px-2 rounded-xl gap-2 flex flex-col shadow-lg w-full mx-11 lg:w-[40rem]">
            <h5 className="text-xl font-medium text-gray-900 dark:text-white">
              Create New Address
            </h5>

            <div className="flex flex-col  ">
              <label htmlFor="type">Address Label</label>
              <input
                type="type"
                name="type"
                id="type"
                className=" bg-gray-50 border-black-300 rounded-md border-2 h-8 w-30 text-xs lg:h-10 focus:border-emerald-300 lg:w-[33rem]"
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            <div className="flex flex-col  ">
              <label htmlFor="street">Street </label>
              <input
                type="text"
                name="street"
                id="street"
                className=" bg-gray-50 border-black-300 rounded-md border-2 h-8 w-30 text-xs lg:h-10 focus:border-emerald-300 lg:w-[33rem]"
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>
            <div className="flex   gap-4">
              <div className="flex flex-col">
                <label htmlFor="province">Province</label>
                <select
                  name="province"
                  id="province"
                  className=" bg-gray-50 border-black-300 rounded-md border-2 h-8 w-30 text-xs lg:h-10 focus:border-emerald-300 lg:w-64"
                  onChange={(e) => setProvinceId(e.target.value)}
                >
                  <option selected>Select Province</option>
                  {renderProvince()}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="city">City</label>
                <select
                  name="city"
                  id="city"
                  className=" bg-gray-50 border-black-300 focus:border-emerald-300 rounded-md border-2 h-8 w-36 text-xs lg:h-10 lg:w-64"
                  onChange={(e) => setCityId(e.target.value)}
                  disabled={cities.length === 0}
                >
                  <option selected>Select City</option>
                  {renderCity()}
                </select>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap lg:flex-nowrap">
              <div className="flex flex-col">
                <label htmlFor="street">District </label>
                <input
                  type="text"
                  name="kecamatan"
                  id="kecamatan"
                  className=" bg-gray-50 border-black-300 rounded-md border-2 h-8 w-52 text-xs lg:h-10 focus:border-emerald-300 lg:w-[16rem]"
                  onChange={(e) => setDistrict(e.target.value)}
                  disabled={city === ""}
                />
              </div>

              <div className="flex flex-col  ">
                <label htmlFor="postal-code">Postal Code </label>
                <input
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  className=" bg-gray-50 border-black-300 rounded-md border-2 h-8 w-36 text-xs lg:h-10 focus:border-emerald-300 lg:w-[16rem]"
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                id="link-checkbox"
                type="checkbox"
                value="true"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={() => setIsPrimary(!isPrimary)}
              />
              <label
                for="link-checkbox"
                className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Set As Primary
              </label>
            </div>
            <div className="flex gap-3 items-center justify-center py-3">
              <button
                className="border-2 border-green-300  font-bold py-2 px-4 rounded-md hover:bg-emerald-500 hover:text-white text-emerald-500"
                onClick={() => addAddress()}
              >
                Save
              </button>
              <button
                className="border-2 border-green-300  font-bold py-2 px-4 rounded-md hover:bg-emerald-500 hover:text-white text-emerald-500"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddressModal;
