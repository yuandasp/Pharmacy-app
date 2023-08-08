import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import Swal from "sweetalert2";

const initialState = {
  transaction: [],
  prescriptions: [],
  selectedTransaction: [],
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setTransaction: (state, action) => {
      state.transaction = action.payload;
    },
    resetTransaction: (state, aciton) => {
      state.transaction = [];
    },
    setSelectedTransaction: (state, action) => {
      state.selectedTransaction = action.payload;
    },
    setPrescription: (state, action) => {
      state.prescriptions = action.payload;
    },
    resetPrescription: (state, action) => {
      state.prescriptions = [];
    },
  },
});

export const addUserOrder = (orderData) => {
  return async (dispatch) => {
    const userId = JSON.parse(localStorage.getItem("user")).iduser;
    let response = await Axios.post(
      `${process.env.REACT_APP_API_BE}/order/setorder/${userId}`,
      orderData
    );
    return response;
  };
};

export const fetchWaitingTransaction = (
  keyword,
  page,
  limit,
  order,
  dateRange
) => {
  return async (dispatch) => {
    const userId = JSON.parse(localStorage.getItem("user")).iduser;
    //backend limits this fetch to 3 with offset for pagination purposes
    const response = await Axios.get(
      `${process.env.REACT_APP_API_BE}/order/waiting/${userId}?search=${
        keyword || ""
      }&page=${page || 0}&limit=${limit || 3}&order=${
        order || "desc"
      }&date=${JSON.stringify(dateRange)}`
    );
    if (response.data.success) {
      dispatch(setTransaction(response.data.waitingOrder));
      return {
        success: response.data.success,
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalOfRows: response.data.totalOfRows,
      };
    } else {
      dispatch(resetTransaction());
      return {
        success: response.data.success,
        page: 0,
        totalPages: 0,
        totalOfRows: 0,
      };
    }
  };
};

export const fetchReviewTransaction = (
  keyword,
  page,
  limit,
  order,
  dateRange
) => {
  return async (dispatch) => {
    const userId = JSON.parse(localStorage.getItem("user")).iduser;
    //backend limits this fetch to 3 with offset for pagination purposes
    const response = await Axios.get(
      `${process.env.REACT_APP_API_BE}/order/review/${userId}?search=${
        keyword || ""
      }&page=${page || 0}&limit=${limit || 3}&order=${
        order || "desc"
      }&date=${JSON.stringify(dateRange)}`
    );
    if (response.data.success) {
      dispatch(setTransaction(response.data.reviewOrder));
      return {
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalOfRows: response.data.totalOfRows,
      };
    } else {
      dispatch(resetTransaction());
      return {
        page: 0,
        totalPages: 0,
        totalOfRows: 0,
      };
    }
  };
};

export const fetchAdminReviewTransaction = (
  keyword,
  page,
  limit,
  order,
  dateRange
) => {
  return async (dispatch) => {
    const idadmin = JSON.parse(localStorage.getItem("admin")).iduser;
    //backend limits this fetch to 3 with offset for pagination purposes
    const response = await Axios.get(
      `${process.env.REACT_APP_API_BE}/order/allreview/${idadmin}?search=${
        keyword || ""
      }&page=${page || 0}&limit=${limit || 3}&order=${
        order || "desc"
      }&date=${JSON.stringify(dateRange)}`
    );
    if (response.data.success) {
      dispatch(setTransaction(response.data.reviewOrder));
      return {
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalOfRows: response.data.totalOfRows,
      };
    } else {
      dispatch(resetTransaction());
      return {
        page: 0,
        totalPages: 0,
        totalOfRows: 0,
      };
    }
  };
};

export const fetchPrescriptionTransaction = (
  keyword,
  page,
  limit,
  order,
  dateRange
) => {
  return async (dispatch) => {
    const userId = JSON.parse(localStorage.getItem("user")).iduser;
    //backend limits this fetch to 3 with offset for pagination purposes
    const response = await Axios.get(
      `${process.env.REACT_APP_API_BE}/order/prescription/${userId}?search=${
        keyword || ""
      }&page=${page || 0}&limit=${limit || 5}&order=${
        order || "desc"
      }&date=${JSON.stringify(dateRange)}`
    );
    if (response.data.success) {
      dispatch(setPrescription(response.data.fetchTransactionOrder));
      return {
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalOfRows: response.data.totalOfRows,
      };
    } else {
      dispatch(resetPrescription());
      return {
        page: 0,
        totalPages: 0,
        totalOfRows: 0,
      };
    }
  };
};

export const fetchAdminPrescriptionTransaction = (
  keyword,
  page,
  limit,
  order,
  dateRange
) => {
  return async (dispatch) => {
    const idadmin = JSON.parse(localStorage.getItem("admin")).idadmin;
    //backend limits this fetch to 3 with offset for pagination purposes
    const response = await Axios.get(
      `${
        process.env.REACT_APP_API_BE
      }/order/allprescription/${idadmin}?search=${keyword || ""}&page=${
        page || 0
      }&limit=${limit || 5}&order=${order || "desc"}&date=${JSON.stringify(
        dateRange
      )}`
    );
    if (response.data.success) {
      dispatch(setPrescription(response.data.fetchPrescriptionOrder));
      return {
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalOfRows: response.data.totalOfRows,
      };
    } else {
      dispatch(resetPrescription());
      return {
        page: 0,
        totalPages: 0,
        totalOfRows: 0,
      };
    }
  };
};

export const fetchFinishedTransaction = (
  keyword,
  page,
  limit,
  order,
  dateRange
) => {
  return async (dispatch) => {
    const iduser = JSON.parse(localStorage.getItem("user")).iduser;
    //backend limits this fetch to 3 with offset for pagination purposes
    const response = await Axios.get(
      `${process.env.REACT_APP_API_BE}/order/finished/${iduser}?search=${
        keyword || ""
      }&page=${page || 0}&limit=${
        limit || 3
      }&order=${order}&date=${JSON.stringify(dateRange)}`
    );
    if (response.data.success) {
      dispatch(setTransaction(response.data.finishedOrder));
      return {
        success: response.data.success,
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalOfRows: response.data.totalOfRows,
      };
    } else {
      dispatch(resetTransaction());
      return {
        success: response.data.success,
        page: 0,
        totalPages: 0,
        totalOfRows: 0,
      };
    }
  };
};

export const fetchAdminFinishedTransaction = (
  keyword,
  page,
  limit,
  sort,
  dateRange
) => {
  return async (dispatch) => {
    const idadmin = JSON.parse(localStorage.getItem("admin")).idadmin;
    //backend limits this fetch to 3 with offset for pagination purposes
    const response = await Axios.get(
      `${process.env.REACT_APP_API_BE}/order/allfinished/${idadmin}?search=${
        keyword || ""
      }&page=${page || 0}&limit=${limit || 3}&sort=${
        sort || "desc"
      }&date=${JSON.stringify(dateRange)}`
    );
    if (response.data.success) {
      dispatch(setTransaction(response.data.finishedOrder));
      return {
        success: response.data.success,
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalOfRows: response.data.totalOfRows,
      };
    } else {
      dispatch(resetTransaction());
      return {
        success: response.data.success,
        page: 0,
        totalPages: 0,
        totalOfRows: 0,
      };
    }
  };
};

export const fetchSendTransaction = (
  keyword,
  page,
  limit,
  order,
  dateRange
) => {
  return async (dispatch) => {
    const iduser = JSON.parse(localStorage.getItem("user")).iduser;
    //backend limits this fetch to 3 with offset for pagination purposes
    const response = await Axios.get(
      `${process.env.REACT_APP_API_BE}/order/send/${iduser}?search=${
        keyword || ""
      }&page=${page || 0}&limit=${limit || 3}&order=${
        order || "desc"
      }&date=${JSON.stringify(dateRange)}`
    );
    if (response.data.success) {
      dispatch(setTransaction(response.data.sendOrder));
      return {
        success: response.data.success,
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalOfRows: response.data.totalOfRows,
      };
    } else {
      dispatch(resetTransaction());
      return {
        success: response.data.success,
        page: 0,
        totalPages: 0,
        totalOfRows: 0,
      };
    }
  };
};

export const fetchAdminSendTransaction = (
  keyword,
  page,
  limit,
  sort,
  dateRange
) => {
  return async (dispatch) => {
    const idadmin = JSON.parse(localStorage.getItem("admin")).idadmin;
    //backend limits this fetch to 3 with offset for pagination purposes
    const response = await Axios.get(
      `${process.env.REACT_APP_API_BE}/order/allsend/${idadmin}?search=${
        keyword || ""
      }&page=${page || 0}&limit=${limit || 3}&sort=${
        sort || "desc"
      }&date=${JSON.stringify(dateRange)}`
    );
    if (response.data.success) {
      dispatch(setTransaction(response.data.sendOrder));
      return {
        success: response.data.success,
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalOfRows: response.data.totalOfRows,
      };
    } else {
      dispatch(resetTransaction());
      return {
        success: response.data.success,
        page: 0,
        totalPages: 0,
        totalOfRows: 0,
      };
    }
  };
};

export const fetchOnProcessTransaction = (
  keyword,
  page,
  limit,
  order,
  dateRange
) => {
  return async (dispatch) => {
    const iduser = JSON.parse(localStorage.getItem("user")).iduser;
    //backend limits this fetch to 3 with offset for pagination purposes
    const response = await Axios.get(
      `${process.env.REACT_APP_API_BE}/order/onprocess/${iduser}?search=${
        keyword || ""
      }&page=${page || 0}&limit=${limit || 3}&order=${
        order || "desc"
      }&date=${JSON.stringify(dateRange)}`
    );
    if (response.data.success) {
      dispatch(setTransaction(response.data.onProcessOrder));
      return {
        success: response.data.success,
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalOfRows: response.data.totalOfRows,
      };
    } else {
      dispatch(resetTransaction());
      return {
        success: response.data.success,
        page: 0,
        totalPages: 0,
        totalOfRows: 0,
      };
    }
  };
};

export const fetchAdminOnProcessTransaction = (
  keyword,
  page,
  limit,
  order,
  dateRange
) => {
  return async (dispatch) => {
    const idadmin = JSON.parse(localStorage.getItem("admin")).idadmin;
    //backend limits this fetch to 3 with offset for pagination purposes
    const response = await Axios.get(
      `${process.env.REACT_APP_API_BE}/order/allonprocess/${idadmin}?search=${
        keyword || ""
      }&page=${page || 0}&limit=${limit || 3}&order=${
        order || "desc"
      }&date=${JSON.stringify(dateRange)}`
    );
    if (response.data.success) {
      dispatch(setTransaction(response.data.onProcessOrder));
      return {
        success: response.data.success,
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalOfRows: response.data.totalOfRows,
      };
    } else {
      dispatch(resetTransaction());
      return {
        success: response.data.success,
        page: 0,
        totalPages: 0,
        totalOfRows: 0,
      };
    }
  };
};

export const fetchAdminWaitingTransaction = (
  keyword,
  page,
  limit,
  order,
  dateRange
) => {
  return async (dispatch) => {
    //backend limits this fetch to 3 with offset for pagination purposes
    const response = await Axios.get(
      `${process.env.REACT_APP_API_BE}/order/allwaiting?search=${
        keyword || ""
      }&page=${page || 0}&limit=${limit || 3}&order=${
        order || "desc"
      }&date=${JSON.stringify(dateRange)}`
    );
    if (response.data.success) {
      dispatch(setTransaction(response.data.allWaitingOrder));
      return {
        success: response.data.success,
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalOfRows: response.data.totalOfRows,
      };
    } else {
      dispatch(resetTransaction());
      return {
        success: response.data.success,
        page: 0,
        totalPages: 0,
        totalOfRows: 0,
      };
    }
  };
};

export const paymentProof = (
  file,
  selectedTransaction,
  modalHandler,
  keyword,
  page,
  limit,
  order,
  dateRange
) => {
  return async (dispatch) => {
    let idtransaction = selectedTransaction.idtransaction;
    const response = await Axios.post(
      `${process.env.REACT_APP_API_BE}/payment/upload/${idtransaction}`,
      file
    );
    if (response.data.success) {
      const condition = Swal.fire({
        icon: "success",
        title: `${response.data.message}`,
        text: "Please wait while we review your payment ^^",
        confirmButtonText: "Ok",
      });
      if ((await condition).isConfirmed) {
        const waitingPageInfo = await dispatch(
          fetchWaitingTransaction(keyword, page, limit, order, dateRange)
        );
        modalHandler();
        return waitingPageInfo;
      }
    }
  };
};

export const acceptPaymentReview = (
  transaction,
  keyword,
  page,
  limit,
  order,
  dateRange
) => {
  return async (dispatch) => {
    const idadmin = JSON.parse(localStorage.getItem("admin")).idadmin;
    const response = await Axios.patch(
      `${process.env.REACT_APP_API_BE}/order/accept/${idadmin}`,
      transaction
    );
    if (response.data.success) {
      const pageStatus = await dispatch(
        fetchAdminReviewTransaction(keyword, page, limit, order, dateRange)
      );
      return {
        pageStatus,
      };
    }
  };
};

export const confirmPaymentReview = (
  transaction,
  keyword,
  page,
  limit,
  order,
  dateRange
) => {
  return async (dispatch) => {
    const iduser = JSON.parse(localStorage.getItem("user")).iduser;
    const response = await Axios.patch(
      `${process.env.REACT_APP_API_BE}/order/confirm/${iduser}`,
      transaction
    );
    if (response.data.success) {
      const pageStatus = await dispatch(
        fetchReviewTransaction(keyword, page, limit, order, dateRange)
      );
      return {
        pageStatus,
      };
    }
  };
};

export const rejectPaymentReview = (
  transaction,
  keyword,
  page,
  limit,
  order,
  dateRange
) => {
  //idadmin here
  const idadmin = JSON.parse(localStorage.getItem("admin")).idadmin;
  return async (dispatch) => {
    const response = await Axios.patch(
      `${process.env.REACT_APP_API_BE}/order/reject/${idadmin}`,
      transaction
    );
    if (response.data.success) {
      const pageStatus = await dispatch(
        fetchAdminReviewTransaction(keyword, page, limit, order, dateRange)
      );

      return {
        pageStatus,
      };
    }
  };
};

export const acceptOnProcessOrder = (
  transaction,
  keyword,
  page,
  limit,
  order,
  dateRange
) => {
  return async (dispatch) => {
    console.log(transaction);
    const idadmin = JSON.parse(localStorage.getItem("admin")).idadmin;
    const response = await Axios.patch(
      `${process.env.REACT_APP_API_BE}/order/submit/${idadmin}`,
      transaction
    );
    if (response.data.success) {
      const pageStatus = await dispatch(
        fetchAdminOnProcessTransaction(keyword, page, limit, order, dateRange)
      );
      return {
        pageStatus,
      };
    }
  };
};

export const completeSendOrder = (
  transaction,
  keyword,
  page,
  limit,
  order,
  dateRange
) => {
  return async (dispatch) => {
    const iduser = JSON.parse(localStorage.getItem("user")).iduser;
    const response = await Axios.patch(
      `${process.env.REACT_APP_API_BE}/order/complete/${iduser}`,
      transaction
    );
    if (response.data.success) {
      const pageStatus = await dispatch(
        fetchSendTransaction(keyword, page, limit, order, dateRange)
      );
      return {
        pageStatus,
      };
    }
  };
};
export const adminCancelOrder = (idTransaction, email) => {
  return async (dispatch) => {
    const idadmin = JSON.parse(localStorage.getItem("admin")).idadmin;
    Swal.fire({
      title: "Loading",
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });
    const response = await Axios.patch(
      `${process.env.REACT_APP_API_BE}/order/cancel-order/${idadmin}`,
      { idTransaction, email }
    );
    Swal.fire(`${response.data.message}`, "", "success");
    window.location.reload();
  };
};

export const userCancelOrder = (idTransaction, email) => {
  return async (dispatch) => {
    const iduser = JSON.parse(localStorage.getItem("user")).iduser;
    Swal.fire({
      title: "Loading",
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });
    const response = await Axios.patch(
      `${process.env.REACT_APP_API_BE}/order/cancelorder/${iduser}`,
      { idTransaction, email }
    );
    Swal.fire(`${response.data.message}`, "", "success");
    window.location.reload();
  };
};

export const {
  setTransaction,
  resetTransaction,
  setSelectedTransaction,
  setPrescription,
  resetPrescription,
} = orderSlice.actions;

export default orderSlice.reducer;
