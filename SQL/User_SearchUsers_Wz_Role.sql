
ALTER proc [dbo].[User_SearchUsers_Wz_Role]
												@PageIndex int
												,@PageSize int 
												,@Query nvarchar(500)


as

/*
--------------------  Test Code ------------------------------------------

    Declare @PageIndex int = 0
			,@PageSize int = 10
	Declare @Query nvarchar(500) = 'Merchant'
	Execute dbo.User_SearchUsers_Wz_Role    @PageIndex
											,@PageSize
											,@Query

	Written by : Jason Lai
	Written Date : 6/7/23
	Reviewed by :
	Modified by : Jason Lai
	Modified Date : 6/22/23
---------------------------------------------------------------------------

*/

Begin
	

	DECLARE @Offset INT = @PageIndex * @PageSize;

		SELECT u.[Id]
		  ,[FirstName]
		  ,[LastName]
		  ,[Mi]
		  ,[AvatarUrl]
		  ,[Email]
		  ,Roles = (select  r.Id as id
							,r.Name as name
					from dbo.Roles as r inner join dbo.UserRoles as ur
					on r.Id = ur.RoleId
					where u.Id = ur.UserId
					FOR JSON AUTO)
		  ,st.[Id] as StatusId
		  ,st.[Name] as StatusName
		  ,[DateCreated]
		  ,[DateModified]
		  ,TotalCount = COUNT(1) OVER ()
	  FROM [dbo].[Users] as u inner join dbo.StatusTypes as st
	  on st.Id = u.StatusId
	      WHERE (FirstName LIKE '%' + @Query + '%'
			OR LastName LIKE '%' + @Query + '%'
			OR Email LIKE '%' + @Query + '%'
			OR st.Name = @Query
			OR @Query in (select r.Name
					from dbo.Roles as r inner join dbo.UserRoles as ur
					on r.Id = ur.RoleId
					where u.Id = ur.UserId))
	ORDER BY u.Id
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY
End
