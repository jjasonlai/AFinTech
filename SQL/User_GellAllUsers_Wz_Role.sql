
ALTER proc [dbo].[User_GetAllUsers_Wz_Role] 
												@PageIndex INT,
												@PageSize INT
								

as

/*


--------------------  Test Code ------------------------------------------

	Declare @PageIndex int = 0
			,@PageSize int = 10

	Execute dbo.User_GetAllUsers_Wz_Role
											@PageIndex,
											@PageSize

	Written by : Jason Lai
	Written Date : 6/5/23
	Reviewed by :
	Modified by : Jason Lai
	Modified Date : 6/20/2023
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

	  ORDER BY u.Id
    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY
End
