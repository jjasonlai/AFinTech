
ALTER PROC [dbo].[Admin_Dash_LoanApplicationsSelectAll]

AS

/*
--------------------  Test Code ------------------------------------------

	Execute [dbo].[Admin_Dash_LoanApplicationsSelectAll]

	Written by : Jason Lai
	Written Date : 6/7/23
	Reviewed by :
	Modified by : Jason Lai
	Modified Date : 6/10/23
---------------------------------------------------------------------------
*/
BEGIN
   
         SELECT
		   la.Id,
           lt.Id as LoanTypeId,
           lt.Name AS LoanTypeName,
           lt.Description,
           la.LoanAmount,
           la.LoanTerm,
           la.PreferredInterestRate,
           la.CreditScore,
           la.StatusId,
           StatusName = (Select st.[Name]
						 From dbo.StatusTypes st
						 Where la.StatusId = st.Id),
           
		   u.Id as UserId,
		   u.FirstName,
		   u.LastName,
		   u.Mi,
		   u.AvatarUrl
    FROM dbo.LoanApplications la

    INNER JOIN dbo.LoanTypes lt ON la.LoanTypeId = lt.Id --Good
    INNER JOIN dbo.Users u ON la.CreatedBy = u.Id --Good

END