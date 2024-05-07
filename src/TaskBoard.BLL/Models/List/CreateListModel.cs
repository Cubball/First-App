namespace TaskBoard.BLL.Models.List;

public class CreateListModel
{
    public string Name { get; set; } = default!;

    public int BoardId { get; set; }
}