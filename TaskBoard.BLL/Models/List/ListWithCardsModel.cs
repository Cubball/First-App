using TaskBoard.BLL.Models.Card;

namespace TaskBoard.BLL.Models.List;

public class ListWithCardsModel
{
    public ListModel List { get; set; } = default!;

    public List<CardShortModel> Cards { get; set; } = default!;
}