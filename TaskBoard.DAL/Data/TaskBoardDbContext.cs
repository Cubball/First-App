using Microsoft.EntityFrameworkCore;
using TaskBoard.DAL.Entities;

namespace TaskBoard.DAL.Data;

public class TaskBoardDbContext : DbContext
{
    public TaskBoardDbContext(DbContextOptions<TaskBoardDbContext> options) : base(options) { }

    public DbSet<Card> Cards { get; set; } = default!;

    public DbSet<List> Lists { get; set; } = default!;

    public DbSet<CardState> CardStates { get; set; } = default!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Card>()
            .HasKey(c => c.Id);
        modelBuilder.Entity<Card>()
            .Property(c => c.Name)
            .HasMaxLength(100);
        modelBuilder.Entity<Card>()
            .Property(c => c.Description)
            .HasMaxLength(1000);
        modelBuilder.Entity<Card>()
            .Property(c => c.Priority)
            .HasMaxLength(50);

        modelBuilder.Entity<Card>()
            .HasOne(c => c.List)
            .WithMany(l => l.Cards)
            .HasForeignKey(c => c.ListId);

        modelBuilder.Entity<List>()
            .HasKey(l => l.Id);
        modelBuilder.Entity<List>()
            .Property(l => l.Name)
            .HasMaxLength(100);

        modelBuilder.Entity<CardState>()
            .HasKey(c => c.Id);
        modelBuilder.Entity<CardState>()
            .Property(c => c.Name)
            .HasMaxLength(100);
        modelBuilder.Entity<CardState>()
            .Property(c => c.Description)
            .HasMaxLength(1000);
        modelBuilder.Entity<CardState>()
            .Property(c => c.Priority)
            .HasMaxLength(50);
    }
}