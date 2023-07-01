using System;
using System.Collections.Generic;

namespace Sabio.Models.Domain.AdminDashboard
{
    public class UserInfo : BaseUser
    {
        public string Email { get; set; }
        public List<LookUp> Roles { get; set; }
        public LookUp StatusTypes { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }

    }   
}
