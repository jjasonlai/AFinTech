using Newtonsoft.Json;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.AdminDashboard;
using Sabio.Models.Domain.Lenders;
using Sabio.Models.Domain.Blogs;
using Sabio.Models.Domain.DashBoards;
using Sabio.Models.Domain.LoanApplications;
using Sabio.Services.Interfaces;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using Sabio.Models.Files;
using Sabio.Models.Domain.Lenders.LenderPlaceholderModels;

namespace Sabio.Services
{
    public class DashboardService : IDashboardService
    {
        readonly IDataProvider _data = null;
        ILookUpService _lookUpService = null;
        IBaseUserMapper _baseUserMapper = null;
        ILoanApplicationService _loanApplication = null;
        IBlogService _blogService = null;
        ILenderService _lenderService = null;
        IFileService _fileService = null;

        public DashboardService(
            IDataProvider data,
            ILookUpService lookUpService,
            IBaseUserMapper baseUserMapper,
            ILoanApplicationService loanApplication, IBlogService blogService, ILenderService lenderService, IFileService fileService
        )
        {
            _data = data;
            _lookUpService = lookUpService;
            _baseUserMapper = baseUserMapper;
            _loanApplication = loanApplication;
            _blogService = blogService;
            _lenderService = lenderService;
            _fileService = fileService;
        }

        public AdminDashboard GetDataForDashboard()
        {
            string procName = "dbo.Admin_Dash_Data ";
            AdminDashboard result = null;
            List<Lender> lenders = null;
            Paged<Borrower> pagedBorrowers = null;
            int totalCountBorrowers = 0;
            List<Borrower> borrowers = null;
            List<LoanApplicationForAdmin> loanApplications = null;
            Paged<UserInfo> pagedUsers = null;
            int totalCountUsers = 0;
            List<UserInfo> users = null;

            _data.ExecuteCmd(
                procName,
                inputParamMapper: null,
                delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    if (set == 0)
                    {
                        result = MapSingleAdmin(reader, ref startingIndex);
                    }
                    else if (set == 1)
                    {
                        Lender aLender = MapSingleLender(reader, ref startingIndex);

                        if (lenders == null)
                        {
                            lenders = new List<Lender>();
                        }
                        lenders.Add(aLender);
                    }
                    else if (set == 2)
                    {
                        Borrower borrower = MapSingleBorrower(reader, ref startingIndex);
                        if (totalCountBorrowers == 0)
                        {
                            totalCountBorrowers = reader.GetSafeInt32(startingIndex++);
                        }

                        if (borrowers == null)
                        {
                            borrowers = new List<Borrower>();
                        }
                        borrowers.Add(borrower);
                    }
                    else if (set == 3)
                    {
                        LoanApplicationForAdmin loanApplication = MapSingleLoanApplication(reader, ref startingIndex);

                        if (loanApplications == null)
                        {
                            loanApplications = new List<LoanApplicationForAdmin>();
                        }
                        loanApplications.Add(loanApplication);
                    }
                    else if (set == 4)
                    {
                        UserInfo anUser = MapSingleUser(reader, ref startingIndex);

                        if (totalCountUsers == 0)
                        {
                            totalCountUsers = reader.GetSafeInt32(startingIndex++);
                        }

                        if (users == null)
                        {
                            users = new List<UserInfo>();
                        }
                        users.Add(anUser);
                    }
                });

            if (borrowers != null)
            {
                pagedBorrowers = new Paged<Borrower>(borrowers, 0, 4, totalCountBorrowers);
            }

            if (users != null)
            {
                pagedUsers = new Paged<UserInfo> ( users, 0, 10, totalCountUsers );
            }


            if (result != null)
            {
                result.Lenders = lenders;
                result.Borrowers = pagedBorrowers;
                result.LoanApplications = loanApplications;
                result.Users = pagedUsers;
            }
            return result;
        }

        public List<Lender> QueryLenders(string query)
        {
            List<Lender> lenders = null;
            string procName = "dbo.Admin_Dash_Lenders_Query";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Query", query);
                }, singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    Lender aLender = MapSingleLender(reader, ref startingIndex);
                    if (lenders == null)
                    {
                        lenders = new List<Lender>();
                    }
                    lenders.Add(aLender);
                });

            return lenders;
        }
        public List<Borrower> QueryBorrowers(string query)
        {
            List<Borrower> borrowers = null;
            string procName = "[dbo].[Admin_Dash_Borrowers_Query]";

            _data.ExecuteCmd(procName
                , delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Query", query);
                }, delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    Borrower aBorrower = MapSingleBorrower(reader, ref startingIndex);

                    if (borrowers == null)
                    {
                        borrowers = new List<Borrower>();
                    }
                    borrowers.Add(aBorrower);
                });

            return borrowers;
        }

        public List<LoanApplicationForAdmin> QueryLoanApplications(string query)
        {
            List<LoanApplicationForAdmin> applications = null;
            string procName = "[dbo].[Admin_Dash_LoanApplications_Query]";

            _data.ExecuteCmd(procName
                , delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Query", query);
                }, delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    LoanApplicationForAdmin anApplication = MapSingleLoanApplication(reader, ref startingIndex);

                    if (applications == null)
                    {
                        applications = new List<LoanApplicationForAdmin>();
                    }
                    applications.Add(anApplication);
                });

            return applications;
        }
        public List<LoanApplicationForAdmin> FilterLoanApplicationsByLoanType(int loanTypeId)
        {
            List<LoanApplicationForAdmin> loanApplications = null;
            string procName = "[dbo].[Admin_Dash_FilterLoanApplicationsByType]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@LoanTypeId", loanTypeId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    LoanApplicationForAdmin anApplication = MapSingleLoanApplication(reader, ref startingIndex);

                    if (loanApplications == null)
                    {
                        loanApplications = new List<LoanApplicationForAdmin>();
                    }
                    loanApplications.Add(anApplication);
                });

            return loanApplications;
        }
        public List<LoanApplicationForAdmin> FilterLoanApplicationsByStatus(int statusId)
        {
            List<LoanApplicationForAdmin> applications = null;
            string procName = "[dbo].[Admin_Dash_FilterLoanApplicationsByStatus]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@StatusId", statusId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    LoanApplicationForAdmin anApplication = MapSingleLoanApplication(reader, ref startingIndex);

                    if (applications == null)
                    {
                        applications = new List<LoanApplicationForAdmin>();
                    }
                    applications.Add(anApplication);
                });

            return applications;
        }
        public Paged<UserInfo> QueryUsers(int pageIndex, int pageSize, string query)
        {
            Paged<UserInfo> pagedUsers = null;
            List<UserInfo> users = null;
            int totalCountUsers = 0;
            string procName = "[dbo].[User_SearchUsers_Wz_Role]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@PageIndex", pageIndex);
                    col.AddWithValue("@PageSize", pageSize);
                    col.AddWithValue("@Query", query);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    UserInfo anUser = MapSingleUser(reader, ref startingIndex);

                    if (totalCountUsers == 0)
                    {
                        totalCountUsers = reader.GetSafeInt32(startingIndex++);
                    }

                    if (users == null)
                    {
                        users = new List<UserInfo>();
                    }
                    users.Add(anUser);
                });

            if (users != null)
            {
                pagedUsers = new Paged<UserInfo>(users, pageIndex, pageSize, totalCountUsers);
            }

            return pagedUsers;
        }
        public Paged<UserInfo> FilterUsersByRole(int pageIndex, int pageSize, int roleId) 
        {
            Paged<UserInfo> pagedUsers = null;
            List<UserInfo> users = null;
            int totalCountUsers = 0;
            string procName = "[dbo].[User_FilterByRole]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@PageIndex", pageIndex);
                    col.AddWithValue("@PageSize", pageSize);
                    col.AddWithValue("@RoleId", roleId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    UserInfo anUser = MapSingleUser(reader, ref startingIndex);

                    if (totalCountUsers == 0)
                    {
                        totalCountUsers = reader.GetSafeInt32(startingIndex++);
                    }

                    if (users == null)
                    {
                        users = new List<UserInfo>();
                    }
                    users.Add(anUser);
                });

            if (users != null)
            {
                pagedUsers = new Paged<UserInfo>(users, pageIndex, pageSize, totalCountUsers);
            }

            return pagedUsers;
        }
        public Paged<UserInfo> FilterUsersByStatus(int pageIndex, int pageSize, int statusId)
        {
            Paged<UserInfo> pagedUsers = null;
            List<UserInfo> users = null;
            int totalCountUsers = 0;
            string procName = "[dbo].[User_FilterByStatus]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@PageIndex", pageIndex);
                    col.AddWithValue("@PageSize", pageSize);
                    col.AddWithValue("@StatusId", statusId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    UserInfo anUser = MapSingleUser(reader, ref startingIndex);

                    if (totalCountUsers == 0)
                    {
                        totalCountUsers = reader.GetSafeInt32(startingIndex++);
                    }

                    if (users == null)
                    {
                        users = new List<UserInfo>();
                    }
                    users.Add(anUser);
                });

            if (users != null)
            {
                pagedUsers = new Paged<UserInfo>(users, pageIndex, pageSize, totalCountUsers);
            }

            return pagedUsers;
        }
        public Paged<UserInfo> PaginateUsers(int pageIndex, int pageSize)
        {

            Paged<UserInfo> pagedUsers = null;
            List<UserInfo> users = null;
            int totalCountUsers = 0;
            string procName = "[dbo].[User_GetAllUsers_Wz_Role]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@PageIndex", pageIndex);
                    col.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    UserInfo anUser = MapSingleUser(reader, ref startingIndex);

                    if (totalCountUsers == 0)
                    {
                        totalCountUsers = reader.GetSafeInt32(startingIndex++);
                    }

                    if (users == null)
                    {
                        users = new List<UserInfo>();
                    }
                    users.Add(anUser);
                });

            if (users != null)
            {
                pagedUsers = new Paged<UserInfo>(users, pageIndex, pageSize, totalCountUsers);
            }

            return pagedUsers;
        }
        public void UpdateRole(int userId, string role)
        {
            string procName = "[dbo].[UserRoles_Update]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@UserId", userId);
                    col.AddWithValue("@Role", role);
                }, returnParameters:null);
        }

        public BorrowerDashboard GetBorrowerDashUI(int pageIndex, int pageSize, int userId)
        {
            BorrowerDashboard dashboard = new BorrowerDashboard();

            List<LoanApplication> application = _loanApplication.GetCurrentPage(pageIndex, pageSize, userId);

            Paged<Blog> blog = _blogService.GetAll(pageIndex, pageSize);

            Paged<Lender> lender = _lenderService.LendersGetByCreatedBy(userId, pageIndex, pageSize);

            Paged<File> files = _fileService.GetByCreatedBy(pageIndex, pageSize, userId);

            dashboard.LoanApplications = application;
            dashboard.Blogs = blog;
            dashboard.Lenders = lender;
            dashboard.Files = files;
            return dashboard;
        }
        private UserInfo MapSingleUser(IDataReader reader, ref int startingIndex)
        {
            UserInfo anUser = new UserInfo();
            anUser.Id = reader.GetSafeInt32(startingIndex++);
            anUser.FirstName = reader.GetSafeString(startingIndex++);
            anUser.LastName = reader.GetSafeString(startingIndex++);
            anUser.Mi = reader.GetSafeString(startingIndex++);
            anUser.AvatarUrl = reader.GetSafeString(startingIndex++);
            anUser.Email = reader.GetSafeString(startingIndex++);
            string rolesString = reader.GetSafeString(startingIndex++);
            if (!string.IsNullOrEmpty(rolesString))
            {
                anUser.Roles = JsonConvert.DeserializeObject<List<LookUp>>(rolesString);
            }
            else
            {
                List<LookUp> roles = new List<LookUp>();
                LookUp rolePlaceholder = new LookUp();
                rolePlaceholder.Name = "Not Assigned";
                rolePlaceholder.Id = 99;
                roles.Add(rolePlaceholder);
                anUser.Roles = roles;
            }
            anUser.StatusTypes = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            anUser.DateCreated = reader.GetSafeDateTime(startingIndex++);
            anUser.DateModified = reader.GetSafeDateTime(startingIndex++);
            return anUser;
        }

        private LoanApplicationForAdmin MapSingleLoanApplication(IDataReader reader, ref int startingIndex)
        {
            LoanApplicationForAdmin loanApplication = new LoanApplicationForAdmin();

            loanApplication.Id = reader.GetSafeInt32(startingIndex++);
            loanApplication.LoanType = _lookUpService.MapSingleLookUp3Col(reader, ref startingIndex);

            loanApplication.LoanAmount = reader.GetSafeInt32(startingIndex++);
            loanApplication.LoanTerm = reader.GetSafeInt32(startingIndex++);
            loanApplication.PreferredInterestRate = reader.GetSafeDecimal(startingIndex++);
            loanApplication.CreditScore = reader.GetSafeInt32(startingIndex++);
            loanApplication.StatusType = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            loanApplication.User = _baseUserMapper.MapBaseUser(reader, ref startingIndex);

            return loanApplication;
        }

        private Borrower MapSingleBorrower(IDataReader reader, ref int startingIndex)
        {
            Borrower borrower = new Borrower();
            borrower.Id = reader.GetSafeInt32(startingIndex++);
            borrower.User = _baseUserMapper.MapBaseUser(reader, ref startingIndex);

            borrower.SSN = reader.GetSafeString(startingIndex++);
            borrower.StatusTypes = _lookUpService.MapSingleLookUp(reader, ref startingIndex);

            borrower.AnnualIncome = reader.GetSafeInt32(startingIndex++);

            borrower.Location = new BaseLocation();
            borrower.Location.Id = reader.GetSafeInt32(startingIndex++);
            borrower.Location.TypeId = reader.GetSafeInt32(startingIndex++);
            borrower.Location.LineOne = reader.GetSafeString(startingIndex++);
            borrower.Location.LineTwo = reader.GetSafeString(startingIndex++);
            borrower.Location.City = reader.GetSafeString(startingIndex++);
            borrower.Location.Zip = reader.GetSafeString(startingIndex++);


            borrower.DateCreated = reader.GetSafeDateTime(startingIndex++);
            borrower.DateModified = reader.GetSafeDateTime(startingIndex++);
            return borrower;
        }

        private Lender MapSingleLender(IDataReader reader, ref int startingIndex)
        {
            Lender lender = new Lender();
            lender.Id = reader.GetSafeInt32(startingIndex++);
            lender.Name = reader.GetSafeString(startingIndex++);
            lender.Description = reader.GetSafeString(startingIndex++);
            lender.LenderType = _lookUpService.MapSingleLookUp(reader, ref startingIndex);

            lender.LoanType = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            lender.StatusType = _lookUpService.MapSingleLookUp(reader, ref startingIndex);



            Location location = new Location();
            location.Id = reader.GetSafeInt32(startingIndex++);
            location.LocationTypeId = reader.GetSafeInt32(startingIndex++);
            location.LineOne = reader.GetSafeString(startingIndex++);
            location.LineTwo = reader.GetSafeString(startingIndex++);
            location.City = reader.GetSafeString(startingIndex++);
            location.Zip = reader.GetSafeString(startingIndex++);
            location.State = reader.GetSafeString(startingIndex++);
            location.Latitude = reader.GetSafeDouble(startingIndex++);
            location.Longitude = reader.GetSafeDouble(startingIndex++);
            location.DateCreated = reader.GetSafeDateTime(startingIndex++);
            location.DateModified = reader.GetSafeDateTime(startingIndex++);
            location.CreatedBy = reader.GetSafeInt32(startingIndex++);
            location.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            location.IsDeleted = reader.GetSafeBool(startingIndex++);
            lender.Location = location;

            lender.Logo = reader.GetSafeString(startingIndex++);
            lender.Website = reader.GetSafeString(startingIndex++);
            lender.DateCreated = reader.GetSafeDateTime(startingIndex++);
            lender.DateModified = reader.GetSafeDateTime(startingIndex++);
            lender.CreatedBy = _baseUserMapper.MapBaseUser(reader, ref startingIndex);
            lender.ModifiedBy = _baseUserMapper.MapBaseUser(reader, ref startingIndex);

            return lender;
        }

        private AdminDashboard MapSingleAdmin(IDataReader reader, ref int startingIndex)
        {
            AdminDashboard result = new AdminDashboard();
            result.SuccessApplications = reader.GetSafeInt32(startingIndex++);
            result.DroppedOffApplications = reader.GetSafeInt32(startingIndex++);
            result.PendingApplications = reader.GetSafeInt32(startingIndex++);
            result.TotalApplications = reader.GetSafeInt32(startingIndex++);
            result.TotalUsers = reader.GetSafeInt32(startingIndex++);
            return result;
        }
    }
}
