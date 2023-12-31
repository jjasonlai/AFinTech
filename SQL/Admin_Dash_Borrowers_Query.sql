ALTER proc [dbo].[Admin_Dash_Borrowers_Query]
											   @Query nvarchar(500)

/*
--------------------  Test Code ------------------------------------------

	Declare @Query nvarchar(500) = 'Johnson'
	Execute [dbo].[Admin_Dash_Borrowers_Query] @Query

	Written by : Jason Lai
	Written Date : 6/8/23
	Reviewed by :
	Modified by :
	Modified Date :
---------------------------------------------------------------------------
*/

AS

BEGIN 


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
    WHERE (u.FirstName LIKE '%' + @Query + '%'
			OR u.LastName LIKE '%' + @Query + '%'
			OR l.LineOne LIKE '%' + @Query + '%'
			OR l.LineTwo LIKE '%' + @Query + '%'
			OR l.City LIKE '%' + @Query + '%')
END