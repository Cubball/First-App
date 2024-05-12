namespace TaskBoard.DAL.Entities;

public class List
{
    public int Id { get; set; }

    public string Name { get; set; } = default!;

    public ICollection<Card> Cards { get; set; } = default!;

    public int BoardId { get; set; }

    public Board Board { get; set; } = default!;
}