namespace TaskBoard.BLL.Models;

public class CardFullModel : CardShortModel
{
    public ListModel List { get; set; } = default!;
}