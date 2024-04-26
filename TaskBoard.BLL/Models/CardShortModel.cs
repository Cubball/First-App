namespace TaskBoard.BLL.Models;

public class CardShortModel
{
    public int Id { get; set; }

    public string Name { get; set; } = default!;

    public string Description { get; set; } = default!;

    public DateTime DueDate { get; set; }

    public string Priority { get; set; } = default!;
}