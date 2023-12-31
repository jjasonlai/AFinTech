
ALTER PROC [dbo].[Admin_Dash_FilterLoanApplicationsByStatus]
												     @StatusId int
AS

/*
--------------------  Test Code ------------------------------------------

	Declare @StatusId int = 1
	Execute [dbo].[Admin_Dash_FilterLoanApplicationsByStatus] @StatusId

	Written by : Jason Lai
	Written Date : 6/27/23
	Reviewed by :
	Modified by :
	Modified Date :
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

    INNER JOIN dbo.LoanTypes lt ON la.LoanTypeId = lt.Id
    INNER JOIN dbo.Users u ON la.CreatedBy = u.Id

	WHERE la.StatusId = @StatusId
END