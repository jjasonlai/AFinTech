
ALTER PROC [dbo].[Admin_Dash_LoanApplications_Query]
												     @Query nvarchar(500)
AS

/*
--------------------  Test Code ------------------------------------------

	Declare @Query nvarchar(500) = 'Active'
	Execute [dbo].[Admin_Dash_LoanApplications_Query] @Query

	Written by : Jason Lai
	Written Date : 6/8/23
	Reviewed by :
	Modified by : Jason Lai
	Modified Date : 6/22/23
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

	WHERE (@Query in (Select st.[Name]
						 From dbo.StatusTypes st
						 Where la.StatusId = st.Id) 
	OR u.[FirstName] LIKE '%' + @Query + '%'
	OR u.[LastName] LIKE '%' + @Query + '%'
	OR lt.Name = @Query)
END