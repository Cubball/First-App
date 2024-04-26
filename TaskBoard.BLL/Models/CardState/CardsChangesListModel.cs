namespace TaskBoard.BLL.Models.CardState;

public class CardsChangesListModel
{
    public int TotalItems { get; set; }

    public int PageSize { get; set; }

    public int PageNumber { get; set; }

    public List<CardChangeModel> Items { get; set; } = default!;
}