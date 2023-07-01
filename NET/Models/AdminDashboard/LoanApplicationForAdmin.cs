using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.AdminDashboard
{
    public class LoanApplicationForAdmin
    {
        public int Id { get; set; }
        public LookUp3Col LoanType { get; set; }
        public int LoanAmount { get; set; }
        public int LoanTerm { get; set; }
        public decimal PreferredInterestRate { get; set; }
        public int CreditScore { get; set; }
        public LookUp StatusType { get; set; }
        public BaseUser User { get; set; }
    }
}
