using TaskBoard.BLL.Models.List;

namespace TaskBoard.BLL.Models.Card;

public class ListWithCardsModel
{
    public ListModel List { get; set; } = default!;

    public List<CardShortModel> Cards { get; set; } = default!;
}