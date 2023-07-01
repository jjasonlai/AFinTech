using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Services.Interfaces;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using Sabio.Models.Domain.Lenders;
using Sabio.Models.Domain;
using System.Collections.Generic;
using Sabio.Models.Domain.LoanApplications;
using Sabio.Models.Domain.DashBoards;
using Sabio.Web.StartUp;
using Sabio.Models.Domain.AdminDashboard;
using Sabio.Models;
using System.Collections;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    public class DashboardApiController : BaseApiController
    {
        private IDashboardService _dashboardService = null;
        private IAuthenticationService<int> _authService = null;
        public DashboardApiController(IDashboardService service,
            ILogger<DashboardApiController> logger,
            IAuthenticationService<int> authentication) : base(logger)
        {
            _dashboardService = service;
            _authService = authentication;

        }

        [HttpGet("borrowers")]
        public ActionResult<ItemResponse<BorrowerDashboard>> GetBorrowersDash(int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();


                BorrowerDashboard dashboard = _dashboardService.GetBorrowerDashUI(pageIndex, pageSize, userId);

                if (dashboard == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Data Not Available");
                }
                else
                {
                    iCode = 200;
                    response = new ItemResponse<BorrowerDashboard> { Item = dashboard };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);

        }

        [HttpGet]
        public ActionResult<ItemResponse<AdminDashboard>> GetDataForDashboard()
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {

                AdminDashboard adminData = _dashboardService.GetDataForDashboard();
                response = new ItemResponse<AdminDashboard> { Item = adminData };
            }
            catch (Exception ex)
            {
                response = new ErrorResponse(ex.Message);
                iCode = 500;
            }


            return StatusCode(iCode, response);
        }

        [HttpGet("search/lenders")]
        public ActionResult<ItemsResponse<BaseLender>> SearchLenders(string query)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<Lender> lenders = _dashboardService.QueryLenders(query);
                response = new ItemsResponse<Lender> { Items = lenders };
            }
            catch (Exception ex)
            {
                response = new ErrorResponse(ex.Message);
                iCode = 500;
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("search/borrowers")]
        public ActionResult<ItemsResponse<Borrower>> SearchBorrowers(string query)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<Borrower> borrowers = _dashboardService.QueryBorrowers(query);
                response = new ItemsResponse<Borrower> { Items = borrowers };
            }
            catch (Exception ex)
            {
                response = new ErrorResponse(ex.Message);
                iCode = 500;
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("search/loanapplications")]
        public ActionResult<ItemsResponse<LoanApplicationForAdmin>> SearchLoanApplications(string query)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<LoanApplicationForAdmin> applications = _dashboardService.QueryLoanApplications(query);
                response = new ItemsResponse<LoanApplicationForAdmin> { Items = applications };
            }
            catch (Exception ex)
            {
                response = new ErrorResponse(ex.Message);
                iCode = 500;
            }

            return StatusCode(iCode, response);
        }
        [HttpGet("filter/loanapplications/loantype")]
        public ActionResult<ItemsResponse<LoanApplicationForAdmin>> FilterLoanApplicationsByLoanType(int loanTypeId) 
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<LoanApplicationForAdmin> applications = _dashboardService.FilterLoanApplicationsByLoanType(loanTypeId);
                response = new ItemsResponse<LoanApplicationForAdmin> { Items = applications };
            }
            catch (Exception ex)
            {
                response = new ErrorResponse(ex.Message);
                iCode = 500;
            }

            return StatusCode(iCode, response);
        }
        [HttpGet("filter/loanapplications/status")]
        public ActionResult<ItemsResponse<LoanApplicationForAdmin>> FilterLoanApplicationsByStatus(int statusId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<LoanApplicationForAdmin> applications = _dashboardService.FilterLoanApplicationsByStatus(statusId);
                response = new ItemsResponse<LoanApplicationForAdmin> { Items = applications };
            }
            catch (Exception ex)
            {
                response = new ErrorResponse(ex.Message);
                iCode = 500;
            }

            return StatusCode(iCode, response);
        }
        [HttpGet("search/users")]
        public ActionResult<ItemResponse<Paged<UserInfo>>> SearchUsers(int pageIndex, int pageSize, string query)
        {
            int iCode = 200;
            BaseResponse response = null;

            Paged<UserInfo> users = _dashboardService.QueryUsers(pageIndex, pageSize, query);

            try
            {
                if (users == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource Not Available.");
                }
                else
                {
                    response = new ItemResponse<Paged<UserInfo>> { Item = users };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }


            return StatusCode(iCode, response);
        }

        [HttpGet("filter/users/role")]
        public ActionResult<ItemResponse<Paged<UserInfo>>> FilterUsersByRole(int pageIndex, int pageSize, int roleId)
        {
            int iCode = 200;
            BaseResponse response = null;

            Paged<UserInfo> users = _dashboardService.FilterUsersByRole(pageIndex, pageSize, roleId);

            try
            {
                if (users == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource Not Available.");
                }
                else
                {
                    response = new ItemResponse<Paged<UserInfo>> { Item = users };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }


            return StatusCode(iCode, response);
        }
        [HttpGet("filter/users/status")]
        public ActionResult<ItemResponse<Paged<UserInfo>>> FilterUsersByStatus(int pageIndex, int pageSize, int statusId)
        {
            int iCode = 200;
            BaseResponse response = null;

            Paged<UserInfo> users = _dashboardService.FilterUsersByStatus(pageIndex, pageSize, statusId);

            try
            {
                if (users == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource Not Available.");
                }
                else
                {
                    response = new ItemResponse<Paged<UserInfo>> { Item = users };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }


            return StatusCode(iCode, response);
        }
        [HttpGet("users")]
        public ActionResult<ItemResponse<Paged<UserInfo>>> PaginateUsers(int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;

            Paged<UserInfo> users = _dashboardService.PaginateUsers(pageIndex, pageSize);

            try
            {
                if (users == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource Not Available.");
                }
                else
                {
                    response = new ItemResponse<Paged<UserInfo>> { Item = users };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }


            return StatusCode(iCode, response);
        }

        [HttpPut("roles")]
        public ActionResult<SuccessResponse> UpdateRole(int userId, string role)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _dashboardService.UpdateRole(userId, role);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                response = new ErrorResponse(ex.Message);
                iCode = 500;
            }

            return StatusCode(iCode, response);
        }
    }
}