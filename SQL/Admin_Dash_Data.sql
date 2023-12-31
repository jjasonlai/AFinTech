ALTER proc [dbo].[Admin_Dash_Data] 

as

/*
--------------------  Test Code ------------------------------------------

	Execute dbo.Admin_Dash_Data 

	Written by : Jason Lai
	Written Date : 6/5/23
	Reviewed by :
	Modified by : Jason Lai
	Modified Date : 6/29/2023
---------------------------------------------------------------------------
*/

Begin



	  SELECT SuccessulApplications = (Select COUNT(*) 
									FROM [dbo].[LoanApplications]
									Where StatusId = 1)

	  ,DroppedApplications = (Select COUNT(*) 
							  FROM [dbo].[LoanApplications]
							  Where StatusId = 2 or StatusId = 5)

	  ,PendingApplications = (Select COUNT(*) 
							  FROM [dbo].[LoanApplications]
							  Where StatusId = 3)
	  ,TotalApplications = (Select COUNT(*)
							FROM [dbo].[LoanApplications])
	  ,Users = (Select COUNT(*)
				FROM dbo.Users)
	
	  Execute [dbo].[Admin_Dash_Lenders_Select] 

	  Declare @PageIndex int = 0
	  ,@PageSize int = 4
	  EXECUTE [dbo].[Admin_Dash_BorrowersSelectAll] @PageIndex
													,@PageSize

	  Execute [dbo].[Admin_Dash_LoanApplicationsSelectAll]

	  Declare @PageSizeA int = 10
	  Execute dbo.User_GetAllUsers_Wz_Role @PageIndex
										   ,@PageSizeA
End