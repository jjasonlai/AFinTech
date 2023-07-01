using Sabio.Models.Domain.Lenders;
using Sabio.Models.Domain.LoanApplications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.AdminDashboard
{
    public class AdminDashboard
    {
        public int SuccessApplications { get; set; }
        public int DroppedOffApplications { get; set; }
        public int PendingApplications { get; set; }
        public int TotalApplications { get; set; }
        public int TotalUsers { get; set; }
        public List<Lender> Lenders { get; set; }
        public Paged<Borrower> Borrowers { get; set; }
        public List<LoanApplicationForAdmin> LoanApplications { get; set; }
        public Paged<UserInfo> Users { get; set; }
    }
}