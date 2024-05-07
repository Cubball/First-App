namespace TaskBoard.BLL.Models.CardState;

public class GetCardsChangesModel
{
    public int BoardId { get; set; }

    public int Page { get; set; }

    public int PageSize { get; set; }
}