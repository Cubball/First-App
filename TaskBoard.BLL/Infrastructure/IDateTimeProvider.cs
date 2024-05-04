namespace TaskBoard.BLL.Infrastructure;

public interface IDateTimeProvider
{
    DateTime UtcNow { get; }
}