using TaskBoard.BLL.Models.List;

namespace TaskBoard.BLL.Models.Board;

public class BoardWithListsModel
{
    public BoardModel Board { get; set; } = default!;

    public List<ListWithCardsModel> Lists { get; set; } = default!;
}