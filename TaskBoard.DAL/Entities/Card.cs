namespace TaskBoard.DAL.Entities;

public class Card
{
    public int Id { get; set; }

    public string Name { get; set; } = default!;

    public string Description { get; set; } = default!;

    public DateTime DueDate { get; set; }

    public string Priority { get; set; } = default!;

    public int ListId { get; set; }

    public List List { get; set; } = default!;
}