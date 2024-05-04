using TaskBoard.BLL.Models.List;

namespace TaskBoard.BLL.Models.Card;

public class CardFullModel : CardShortModel
{
    public ListModel List { get; set; } = default!;
}