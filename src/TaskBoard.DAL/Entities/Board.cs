namespace TaskBoard.DAL.Entities;

public class Board
{
    public int Id { get; set; }

    public string Name { get; set; } = default!;

    public ICollection<List> Lists { get; set; } = default!;
}