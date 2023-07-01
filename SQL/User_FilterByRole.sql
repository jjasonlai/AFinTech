
ALTER proc [dbo].[User_FilterByRole]
												@PageIndex int
												,@PageSize int 
												,@RoleId int


as

/*
--------------------  Test Code ------------------------------------------

    Declare @PageIndex int = 0
			,@PageSize int = 10
	Declare @RoleId int = '1'
	Execute dbo.User_FilterByRole   @PageIndex
											,@PageSize
											,@RoleId

	Written by : Jason Lai
	Written Date : 6/26/23
	Reviewed by :
	Modified by : 
	Modified Date :
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
	      WHERE (@RoleId in (select r.Id
					from dbo.Roles as r inner join dbo.UserRoles as ur
					on r.Id = ur.RoleId
					where u.Id = ur.UserId))
	ORDER BY u.Id

    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY
End
