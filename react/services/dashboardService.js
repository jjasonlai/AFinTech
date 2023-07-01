import axios from "axios";
import * as helper from "../services/serviceHelpers";

const dashBoardsService = {
  endpoint: `${helper.API_HOST_PREFIX}/api/dashboard`,
};

dashBoardsService.getBorrowersUI = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${dashBoardsService.endpoint}/borrowers/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

dashBoardsService.getDashboardData = () => {
  const config = {
    method: "GET",
    url: `${dashBoardsService.endpoint}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

dashBoardsService.searchLenders = (query) => {
  const config = {
    method: "GET",
    url: `${dashBoardsService.endpoint}/search/lenders/?query=${query}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

dashBoardsService.searchLoanApplications = (query) => {
  const config = {
    method: "GET",
    url: `${dashBoardsService.endpoint}/search/loanapplications/?query=${query}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

dashBoardsService.filterLoanApplicationsByStatus = (statusId) => {
  const config = {
    method: "GET",
    url: `${dashBoardsService.endpoint}/filter/loanapplications/status/?statusid=${statusId}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

dashBoardsService.filterLoanApplicationsByLoanType = (loanTypeId) => {
  const config = {
    method: "GET",
    url: `${dashBoardsService.endpoint}/filter/loanapplications/loantype/?loantypeid=${loanTypeId}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

dashBoardsService.searchUsers = (pageIndex, query) => {
    const config=
    {
        method: "GET",
        url: `${dashBoardsService.endpoint}/search/users/?pageIndex=${pageIndex}&pageSize=10&query=${query}`,
        crossdomain: true,
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    }
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
}

dashBoardsService.getNextPageUsers = (pageIndex) => {
    const config=
    {
        method: "GET",
        url: `${dashBoardsService.endpoint}/users/?pageIndex=${pageIndex}&pageSize=10`,
        crossdomain: true,
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    }
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
}

  dashBoardsService.filterUsersByRole = (pageIndex, pageSize, roleId) => {
    const config=
    {
        method: "GET",
        url: `${dashBoardsService.endpoint}/filter/users/role/?pageIndex=${pageIndex}&pageSize=${pageSize}&roleId=${roleId}`,
        crossdomain: true,
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    }
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
  }

  dashBoardsService.filterUsersByStatus = (pageIndex, pageSize, statusId) => {
    const config=
    {
        method: "GET",
        url: `${dashBoardsService.endpoint}/filter/users/status/?pageIndex=${pageIndex}&pageSize=${pageSize}&statusId=${statusId}`,
        crossdomain: true,
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    }
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
  }

dashBoardsService.updateRole = (userId, role) => {
    const config=
    {
        method: "PUT",
        url: `${dashBoardsService.endpoint}/roles/?userId=${userId}&role=${role}`,
        crossdomain: true,
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
    }
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
}

export default dashBoardsService;
