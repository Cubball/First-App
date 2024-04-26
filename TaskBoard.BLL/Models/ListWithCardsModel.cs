namespace TaskBoard.BLL.Models;

public class ListWithCardsModel
{
    public ListModel List { get; set; } = default!;

    public List<CardShortModel> Cards { get; set; } = default!;
}