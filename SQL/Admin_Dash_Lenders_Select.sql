
ALTER Proc [dbo].[Admin_Dash_Lenders_Select] 

as 


/*
--------------------  Test Code ------------------------------------------
	EXECUTE [dbo].[Admin_Dash_Lenders_Select]

	Written by : Jason Lai
	Written Date : 6/6/23
	Reviewed by :
	Modified by :
	Modified Date :
---------------------------------------------------------------------------
*/
begin 
/*
  Select l.[Name]
						 ,Logo
						 ,Website
						 ,StatusId
						 ,CreatedBy
						 ,ModifiedBy
	              From dbo.Lenders as l
				  */

   SELECT 
        [L].[Id], 
        [L].[Name], 
		[L].[Description],
        [LT].[Id] AS [LenderTypeId],
        [LT].[Name] AS [LenderTypeName],
        [LoT].[Id] AS [LoanTypeId], 
        [LoT].[Name] AS [LoanTypeName], 
        [ST].[Id] AS [StatusId],
        [ST].[Name] AS [StatusName], 
        [Loc].[Id] AS [LocationId], 
        [Loc].[LocationTypeId], 
        [Loc].[LineOne], 
        [Loc].[LineTwo], 
        [Loc].[City], 
        [Loc].[Zip], 
        [S].[Name] AS [StateName], 
        [Loc].[Latitude], 
        [Loc].[Longitude], 
        [Loc].[DateCreated], 
        [Loc].[DateModified], 
        [Loc].[CreatedBy], 
        [Loc].[ModifiedBy], 
        [Loc].[IsDeleted] AS [LocationIsDeleted],
        [L].[Logo], 
        [L].[Website], 
        [L].[DateCreated], 
        [L].[DateModified], 
        [UC].Id, 
		UC.FirstName,
		UC.LastName,
		UC.Mi,
		UC.AvatarUrl,
        [UM].Id,
		UM.FirstName,
		UM.LastName,
		UM.Mi,
		UM.AvatarUrl,
        [TotalCount] = COUNT(1) OVER()
    FROM [dbo].[Lenders] AS [L]
    INNER JOIN [dbo].[LenderTypes] AS [LT]
        ON [L].[LenderTypeId] = [LT].[Id]
    INNER JOIN [dbo].[LoanTypes] AS [LoT]
        ON [L].[LoanTypeId] = [LoT].[Id]
    INNER JOIN [dbo].[StatusTypes] AS [ST]
        ON [L].[StatusId] = [ST].[Id]
    INNER JOIN [dbo].[Locations] AS [Loc]
        ON [Loc].[Id] = [L].[LocationId]
    INNER JOIN [dbo].[States] AS [S]
        ON [S].[Id] = [Loc].[StateId]
	INNER JOIN dbo.Users as UC
		ON L.CreatedBy = UC.Id
	INNER JOIN dbo.Users as UM
		ON L.ModifiedBy = UM.Id

    ORDER BY [L].[DateCreated] DESC
			
end 