import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

const initialState = {
  chartReport: [],
  salesReport: [],
};

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    addReport: (state, action) => {
      state.salesReport = action.payload;
    },
    resetReport: (state, action) => {
      state.salesReport = [];
    },
    addChartReport: (state, action) => {
      state.chartReport = action.payload;
    },
    resetChartReport: (state, action) => {
      state.chartReport = [];
    },
    ascTransactionReport: (state, action) => {
      state.salesReport = state.salesReport.sort((a, b) => b.total - a.total);
    },
    descTransactionReport: (state, action) => {
      state.salesReport = state.salesReport.sort((a, b) => a.total - b.total);
    },
    ascUserReport: (state, action) => {
      state.salesReport = state.salesReport.sort(
        (a, b) => b.TotalPrice - a.TotalPrice
      );
    },
    descUserReport: (state, action) => {
      state.salesReport = state.salesReport.sort(
        (a, b) => a.TotalPrice - b.TotalPrice
      );
    },
    ascProductReport: (state, action) => {
      state.salesReport = state.salesReport.sort(
        (a, b) => b.purchase - a.purchase
      );
    },
    descProductReport: (state, action) => {
      state.salesReport = state.salesReport.sort(
        (a, b) => a.purchase - b.purchase
      );
    },
  },
});

export const getSalesReport = (page, dateRange) => {
  return async (dispatch) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BE}/report/transactions?page=${
        page || 0
      }&date=${JSON.stringify(dateRange)}`
    );
    if (response.data.success) {
      dispatch(addReport(response.data.report));
      dispatch(getAllSalesReport(dateRange));
      return {
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalOfRows: response.data.totalOfRows,
      };
    } else {
      dispatch(resetChartReport());
      dispatch(resetReport());
      return {
        page: 0,
        totalPages: 0,
        totalOfRows: 0,
      };
    }
  };
};

export const getAllSalesReport = (dateRange) => {
  return async (dispatch) => {
    const response = await axios.get(
      `${
        process.env.REACT_APP_API_BE
      }/report/alltransaction?date=${JSON.stringify(dateRange)}`
    );
    dispatch(addChartReport(response.data.report));
  };
};

export const getUserSalesReport = (page, dateRange) => {
  return async (dispatch) => {
    const response = await axios.get(
      `${
        process.env.REACT_APP_API_BE
      }/report/usertransaction?page=${page}&date=${JSON.stringify(dateRange)}`
    );
    if (response.data.success) {
      dispatch(addReport(response.data.report));
      dispatch(getAllUserSalesReport(dateRange));
      return {
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalOfRows: response.data.totalOfRows,
      };
    } else {
      dispatch(resetChartReport());
      dispatch(resetReport());
      return {
        page: 0,
        totalPages: 0,
        totalOfRows: 0,
      };
    }
  };
};

export const getAllUserSalesReport = (dateRange) => {
  return async (dispatch) => {
    const response = await axios.get(
      `${
        process.env.REACT_APP_API_BE
      }/report/allusertransaction?date=${JSON.stringify(dateRange)}`
    );
    dispatch(addChartReport(response.data.report));
  };
};

export const getProductSalesReport = (page, dateRange) => {
  return async (dispatch) => {
    const response = await axios.get(
      `${
        process.env.REACT_APP_API_BE
      }/report/producttransaction?page=${page}&date=${JSON.stringify(
        dateRange
      )}`
    );
    if (response.data.success) {
      dispatch(addReport(response.data.report));
      dispatch(getAllProductSalesReport(dateRange));
      return {
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalOfRows: response.data.totalOfRows,
      };
    } else {
      dispatch(resetChartReport());
      dispatch(resetReport());
      return {
        page: 0,
        totalPages: 0,
        totalOfRows: 0,
      };
    }
  };
};

export const getAllProductSalesReport = (dateRange) => {
  return async (dispatch) => {
    const response = await axios.get(
      `${
        process.env.REACT_APP_API_BE
      }/report/allproducttransaction?date=${JSON.stringify(dateRange)}`
    );
    dispatch(addChartReport(response.data.report));
  };
};

export const {
  addReport,
  ascTransactionReport,
  resetReport,
  addChartReport,
  resetChartReport,
  descTransactionReport,
  ascUserReport,
  descUserReport,
  ascProductReport,
  descProductReport,
} = reportSlice.actions;

export default reportSlice.reducer;
