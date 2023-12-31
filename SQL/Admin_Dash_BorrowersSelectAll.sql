
ALTER proc [dbo].[Admin_Dash_BorrowersSelectAll]
												 @PageIndex int
										        ,@PageSize int


/*
--------------------  Test Code ------------------------------------------
	Execute [dbo].[Admin_Dash_BorrowersSelectAll]

	Written by : Jason Lai
	Written Date : 6/7/23
	Reviewed by :
	Modified by : Jason Lai
	Modified Date : 6/19/23
---------------------------------------------------------------------------
*/

AS

BEGIN 
	Declare @offset int =@PageIndex * @PageSize

	SELECT b.[Id]
		,u.Id as UserId
		,u.FirstName
		,u.LastName
		,u.Mi
		,u.AvatarUrl
		,b.[SSN]
		,st.[Id] as StatusId
		,st.[Name] as StatusName
		,b.[AnnualIncome]
		,l.Id as LocationId
		,l.LocationTypeId
		,l.LineOne
		,l.LineTwo
		,l.City
		,l.Zip
      ,b.[DateCreated]
      ,b.[DateModified]
	  ,TotalCount = COUNT(1) OVER()
   FROM [dbo].[Borrowers] as b inner join dbo.Users as u
				on b.UserId = u.Id
				inner join dbo.Locations as l
				on l.Id = b.LocationId
				inner join dbo.StatusTypes as st
				on st.Id = b.StatusId

	ORDER BY b.Id
	OFFSET @offset  Rows
	FETCH NEXT @PageSize ROWS ONLY

END